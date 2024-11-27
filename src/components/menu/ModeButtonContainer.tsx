export default function ModeButtonContainer({
  imgElement,
  mainElement,
}: {
  imgElement: React.ReactNode;
  mainElement: React.ReactNode;
}) {
  return (
    <div className="menu-item">
      <div className="w-12">{imgElement}</div>
      <div className="flex flex-row justify-between flex-grow pl-2 pt-0.5">
        {mainElement}
      </div>
    </div>
  );
}
