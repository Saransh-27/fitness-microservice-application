package com.microservice.project.ai_service.service;

import com.microservice.project.ai_service.entity.Activity;
import com.microservice.project.ai_service.entity.Recommendation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityAIService {
    private final GeminiService geminiService;

    public Recommendation generateRecommendation(Activity activity){
        String prompt = createPromptForActivity(activity);
        String aiResponse = geminiService.getAnswer(prompt);
        log.info("AI Response is {}", aiResponse);
        processAiResponse(activity, aiResponse);
        return processAiResponse(activity, aiResponse);
    }

    private Recommendation processAiResponse(Activity activity, String aiResponse){
        try{
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(aiResponse);

            JsonNode textNode = rootNode.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text");

            String jsonContent = textNode.asString()
                    .replaceAll("```json\\n","")
                    .replaceAll("\\n```", "")
                    .trim();

//            log.info("AI PARSED Response is {}", jsonContent);

            JsonNode analysisJson = mapper.readTree(jsonContent);
            JsonNode analysisNode = analysisJson.path("analysis");
            StringBuilder fullAnalysis = new StringBuilder();
            addAnalysisSection(fullAnalysis, analysisNode, "overall", "OverAll : ");
            addAnalysisSection(fullAnalysis, analysisNode, "pace", "Pace : ");
            addAnalysisSection(fullAnalysis, analysisNode, "heartRate", "Heart Rate : ");
            addAnalysisSection(fullAnalysis, analysisNode, "caloriesBurned", "Calories : ");

            List<String> improvements =extractImprovements(analysisJson.path("improvements"));
            List<String> suggestions =extractSuggestions(analysisJson.path("suggestions"));
            List<String> safety =extractSafetyGuidelines(analysisJson.path("safety"));

            return Recommendation.builder()
                    .activityId(activity.getId())
                    .userId(activity.getUserid())
                    .activityType(activity.getType())
                    .recommendation(fullAnalysis.toString().trim())
                    .improvements(improvements)
                    .suggestions(suggestions)
                    .safety(safety)
                    .createdAt(LocalDateTime.now())
                    .build();
        }catch (Exception e){
            e.printStackTrace();
            log.error("Error occurred while processing AI response");
            return createDefaultRecommendation(activity);
        }
    }

    private Recommendation createDefaultRecommendation(Activity activity) {
        return Recommendation.builder()
                .activityId(activity.getId())
                .userId(activity.getUserid())
                .activityType(activity.getType())
                .recommendation("No specific recommendation provided")
                .improvements(Collections.singletonList("No improvements found"))
                .suggestions(Collections.singletonList("No specific suggestion provided"))
                .safety(Arrays.asList("Always warn up before exercise",
                        "Stay hydrated",
                        "Listen to your body and rest when needed"))
                .createdAt(LocalDateTime.now())
                .build();
    }

    private List<String> extractSafetyGuidelines(JsonNode safetyNode) {
        List<String> safety = new ArrayList<>();
        if (safetyNode.isArray()) {
            safetyNode.forEach(item -> safety.add(item.asString()));
        }
        return safety.isEmpty()?
                Collections.singletonList("Follow general safety guidelines") :
                safety;
    }

    private List<String> extractSuggestions(JsonNode suggestionsNode) {
        List<String> suggestions = new ArrayList<>();
        if (suggestionsNode.isArray()){
            suggestionsNode.forEach(improvementNode -> {
                String workout = improvementNode.path("workout").asString();
                String description = improvementNode.path("description").asString();
                suggestions.add(String.format("%s:, %s", workout, description));
            });
        }
            return suggestions.isEmpty() ?
                    Collections.singletonList("No specific suggestion provided") :
                    suggestions;
    }

    private List<String> extractImprovements(JsonNode improvementsNode) {
        List<String> improvements = new ArrayList<>();
        if (improvementsNode.isArray()){
            improvementsNode.forEach(improvementNode -> {
                String area = improvementNode.path("area").asString();
                String detail = improvementNode.path("recommendation").asString();
                improvements.add(String.format("%s:, %s", area, detail));
            });
        }
        return improvements.isEmpty()?
                Collections.singletonList("No improvements found") : improvements;
    }

    private void addAnalysisSection(StringBuilder fullAnalysis, JsonNode analysisNode, String key, String prefix) {
       if (!analysisNode.path(key).isMissingNode()){
           fullAnalysis.append(prefix)
                   .append(analysisNode.path(key).asString())
                   .append("\n\n");
       }
    }

    private String createPromptForActivity(Activity activity) {
        return String.format("""
        Analyze this fitness activity and provide detailed recommendations in the following EXACT JSON format:
        {
          "analysis": {
            "overall": "Overall analysis here",
            "pace": "Pace analysis here",
            "heartRate": "Heart rate analysis here",
            "caloriesBurned": "Calories analysis here"
          },
          "improvements": [
            {
              "area": "Area name",
              "recommendation": "Detailed recommendation"
            }
          ],
          "suggestions": [
            {
              "workout": "Workout name",
              "description": "Detailed workout description"
            }
          ],
          "safety": [
            "Safety point 1",
            "Safety point 2"
          ]
        }

        Analyze this activity:
        Activity Type: %s
        Duration: %d minutes
        Calories Burned: %d
        Additional Metrics: %s
        
        Provide detailed analysis focusing on performance, improvements, next workout suggestions, and safety guidelines.
        Ensure the response follows the EXACT JSON format shown above.
        """,
                activity.getType(),
                activity.getDuration(),
                activity.getCaloriesBurned(),
                activity.getAdditionalMatrics()
        );
    }
}

