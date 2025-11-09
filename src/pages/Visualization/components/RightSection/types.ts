// 타입 정의 파일

export interface State {
  objects: any[];
}

export interface ApiError {
  code: string;
  result: {
    error: string[];
    lineNumber?: string;
    errorMessage?: string;
  };
  message: string;
}

export interface SuccessResponse {
  result: {
    code: any[];
    output?: string;
  };
}

export interface RightSectionProps {
  onboardingStep: boolean[];
  setTutorialPosition: React.Dispatch<React.SetStateAction<{ top: number; left: number }>>;
}

