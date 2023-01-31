const key = "24da15f25e0e4dcfb91cc14bded3f2aa";

const app = document.getElementById("root");

const container = document.createElement("div");
container.setAttribute("class", "container");

app.appendChild(container);

const query = async function () {
  try {
    const response = await fetch(
      `https://ghibliapi.herokuapp.com/films?api_key=24da15f25e0e4dcfb91cc14bded3f2aa
      `
    );
    const data = await response.json();
    data.forEach((movie) => {
      const card = document.createElement("div");
      card.setAttribute("class", "card");

      const h1 = document.createElement("h1");
      h1.textContent = movie.title;

      const p = document.createElement("p");
      p.textContent = `${movie.description}`;

      container.appendChild(card);
      card.appendChild(h1);
      card.appendChild(p);
    });
  } catch (err) {
    console.log(err);
  }
};

query();
