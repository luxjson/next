'use client';

import { useEffect } from 'react';
const useExternalStyle = (fileName) => {
  useEffect(() => {
    if (!fileName) return;
    const cssUrl = `/assets/styles/${fileName}`;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssUrl;
    link.type = 'text/css';
    link.dataset.dynamicCss = fileName;
    const existingLink = document.querySelector(`link[data-dynamic-css="${fileName}"]`);
    
    if (!existingLink) {
      document.head.appendChild(link);
    }
    return () => {
      const linkToRemove = document.querySelector(`link[data-dynamic-css="${fileName}"]`);
      if (linkToRemove && document.head.contains(linkToRemove)) {
        document.head.removeChild(linkToRemove);
      }
    };
  }, [fileName]);
};

export default useExternalStyle;