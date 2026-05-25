interface SectionErrorProps {
  section?: string;
}

const SectionError = ({ section = 'section' }: SectionErrorProps) => {
  return (
    <div className="section-error">
      <p>Failed to load {section}. Please refresh the page.</p>
    </div>
  );
};

export default SectionError;
