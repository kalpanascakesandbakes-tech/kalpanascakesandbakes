import { useEffect } from 'react';

export const useDocumentMetadata = (title, description) => {
  useEffect(() => {
    if (title) {
      document.title = `${title} | Kalpana's Cakes & Bakes`;
    }
    
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = description;
    }
  }, [title, description]);
};

export default useDocumentMetadata;
