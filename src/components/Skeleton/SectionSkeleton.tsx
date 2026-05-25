interface SectionSkeletonProps {
  type?: 'hero' | 'about' | 'manifesto' | 'projects';
}

const SectionSkeleton = ({ type = 'hero' }: SectionSkeletonProps) => {
  return (
    <div className={`section-skeleton section-skeleton--${type}`}>
      <div className="skeleton-pulse" />
    </div>
  );
};

export default SectionSkeleton;
