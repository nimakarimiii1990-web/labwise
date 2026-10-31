export interface CapabilityItem {
  id: string;
  titleFa: string;
  titleEn: string;
  category: 'frontend' | 'backend' | 'database' | 'ai' | 'integrations' | 'transformation';
  descriptionFa: string;
  descriptionEn: string;
  featuresFa: string[];
  featuresEn: string[];
  techStack: string[];
  examplePromptFa: string;
  examplePromptEn: string;
  isPopular?: boolean;
}

export interface PromptTemplate {
  id: string;
  titleFa: string;
  titleEn: string;
  category: string;
  complexity: 'ساده' | 'متوسط' | 'پیشرفته';
  estimatedTimeFa: string;
  promptFa: string;
  promptEn: string;
  recommendedStack: string[];
}

export interface FaqItem {
  questionFa: string;
  questionEn: string;
  answerFa: string;
  answerEn: string;
  category: 'free' | 'capabilities' | 'export' | 'database';
}
