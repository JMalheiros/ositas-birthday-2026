const TitleHeader = () => {
  return (
    <header className="w-full grid grid-cols-5 py-2">
      <img src="/title-header.png"
           alt="Título da página"
           className="max-h-30 col-span-5 lg:col-span-3 lg:col-start-2" />
    </header>
  );
}

export default TitleHeader;
