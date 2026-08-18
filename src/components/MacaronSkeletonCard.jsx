import React from 'react';
import './MacaronSkeletonCard.css';

export const MacaronSkeletonCard = () => {
  return (
    <div className="macaron-skeleton-card" aria-hidden="true">
      <div className="macaron-skeleton-image-wrapper">
        <div className="macaron-skeleton-image macaron-skeleton-pulse" />
        <div className="macaron-skeleton-badge macaron-skeleton-pulse" />
      </div>
      <div className="macaron-skeleton-info">
        <div className="macaron-skeleton-title macaron-skeleton-pulse" />
        <div className="macaron-skeleton-price macaron-skeleton-pulse" />
        <div className="macaron-skeleton-stars macaron-skeleton-pulse" />
        <div className="macaron-skeleton-select macaron-skeleton-pulse" />
        <div className="macaron-skeleton-button macaron-skeleton-pulse" />
      </div>
    </div>
  );
};

export const MacaronSkeletonGrid = ({ count = 6 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <MacaronSkeletonCard key={index} />
      ))}
    </>
  );
};

export default MacaronSkeletonCard;
