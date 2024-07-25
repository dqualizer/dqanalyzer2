export default function FileWriterService(scenarioArray) {
  let content = "";

  for (let index = 1; index <= scenarioArray.length; index++) {
    content =
      content + index + ": " + scenarioArray[index - 1].description + "\n";
  }

  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "example.txt";
  link.click();

  URL.revokeObjectURL(url);
  return null;
}
