import QuestionSuggestionTile from "./QuestionSuggestionTile.tsx";
import {QuestionSuggestion} from "./questionsReducer.tsx";


export default function QuestionSuggestions({questionSuggestion, i}: { questionSuggestion: QuestionSuggestion, i: number }) {
    return (
        <div className="container suggestions animate-fade-down">
            {questionSuggestion.suggestions.map((suggestion, j) => {
                return (
                    <QuestionSuggestionTile
                        questionSuggestion={questionSuggestion}
                        suggestion={suggestion}
                        j={j}
                        key={`question_${i}_suggestion_${j}`}
                    />
                );
            })}
        </div>
    )
}