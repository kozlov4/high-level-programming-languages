fetch("image.json")
  .then((response) => response.json())
  .then((data) => {
    const imgElement = document.createElement("img");
    imgElement.src = data.imageUrl;
    imgElement.alt = "Зображення з JSON";
    document.getElementById("image-container").appendChild(imgElement);
  })
  .catch(() => console.log("ERROR"));
