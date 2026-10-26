export default function PageHead({ title, description, children }) {
  return (
    <header className="page-head page-head--row">
      <div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {children && <div className="page-actions">{children}</div>}
    </header>
  );
}
