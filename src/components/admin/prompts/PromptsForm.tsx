import AdminContainer from "../AdminContainer";


export default function PromptsForm() {
  // http://localhost:8085/prompts/de?add_ids=true
  return (
    <AdminContainer
      title="Prompts"
      processing={false}
      message={undefined}
      messageType={undefined}
    >
        {/* TODO: Add form here */}
      <div>PromptsForm</div>
    </AdminContainer>
  );
}