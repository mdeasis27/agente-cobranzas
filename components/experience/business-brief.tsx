import {StoryBrief} from "@/design-system/demo/decision-lab";
import stories from "@/docs/quality/business-story.json";
export function BusinessBrief({lang}:{lang:"en"|"es"}) {
 const s=stories[lang];
 return <StoryBrief locale={lang} story={{eyebrow:lang==="en"?"Decision lab":"Laboratorio de decisiones",mission:lang==="en"?"Put the right account at the front of the queue.":"Pon la cuenta correcta al frente de la cola.",context:s.problem,role:s.user,decision:s.decision,stakes:s.value}}/>;
}
