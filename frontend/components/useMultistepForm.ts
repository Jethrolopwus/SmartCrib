"use client";

import React, { useState } from "react";

function useMultistepForm(steps: React.ReactElement<{ fields: any[] }>[]) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const next = () => {
    setCurrentStepIndex((i) => {
      if (i >= steps.length - 1) return i;
      return i + 1;
    });
  };

  const back = () => {
    setCurrentStepIndex((i) => {
      if (i <= 0) return i;
      return i - 1;
    });
  };

  const goTo = (index: number) => {
    setCurrentStepIndex(index);
  };
  return {
    currentStepIndex,
    step: steps[currentStepIndex],
    goTo,
    next,
    isFirstStep: currentStepIndex !== 0,
    isLastStep: currentStepIndex === steps.length - 1,
    back,
    steps,
  };
}

export default useMultistepForm;
