// app/components/ViewsCounter.js
'use client';

import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';

const ViewsCounter = ({ slug, initialViews = 0 }) => {
  const [views, setViews] = useState(initialViews);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Component mount होने पर views increment करें
    const incrementViews = async () => {
      if (!slug) return;
      
      setLoading(true);
      
      try {
        const response = await fetch(`/api/views/${slug}`, {
          method: 'POST',
        });
        
        if (response.ok) {
          const data = await response.json();
          setViews(data.views);
        }
      } catch (error) {
        console.error('Error incrementing views:', error);
      } finally {
        setLoading(false);
      }
    };

    // Page load होने पर views increment करें
    const timer = setTimeout(incrementViews, 1000);
    
    return () => clearTimeout(timer);
  }, [slug]);

  if (loading && views === 0) {
    return (
      <div className="flex items-center gap-1 text-gray-600">
        <Eye size={16} />
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 text-gray-600">
      <Eye size={16} />
      <span>{views.toLocaleString()} views</span>
    </div>
  );
};

export default ViewsCounter;