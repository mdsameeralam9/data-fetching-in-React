import React from "react";

const ProductListSkeleton = () => {
    const skeletonCards = Array.from({ length: 10 });

    return (
        <div className="skeleton-container">
            {skeletonCards.map((_, index) => (
                <div className="skeleton-card" key={index}>
                    <div className="skeleton-image" />
                    <div className="skeleton-text short" />
                    <div className="skeleton-text long" />
                </div>
            ))}
        </div>
    );
};

export default ProductListSkeleton;
