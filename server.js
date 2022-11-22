import express from 'express';
import axios from 'axios';
import _ from 'lodash';

const app = express()
const port = 3000

async function getAllPeople() {
  let nextPage = 'https://swapi.dev/api/people/';
  let people = [];

  while (nextPage) {
    let nextres = await axios(nextPage)
    const { next, results } = await nextres.data;
    nextPage = next
    people = [...people, ...results]
  }

  return people;
}

async function getAllPlanets() {
  let nextPage = 'https://swapi.dev/api/planets/';
  let planets = [];

  while (nextPage) {
    let nextres = await axios(nextPage)
    const { next, results } = await nextres.data;
    nextPage = next
    planets = [...planets, ...results]
  }

  return planets;
}

app.get('/people', async (req, res) => {
  let people = await getAllPeople();

  switch(req.query.sortBy) {
    case "name":
      people = _.orderBy(people, "name", "asc");
      break;
    case "height":
      people = _.orderBy(people, person => +person.height, "asc");
      break;
    case "mass":
      people = _.orderBy(people, person => +person.mass, "asc");
      break;
    default:
      break;
  }
  res.send(people);

});

app.get('/planets', async (req, res) => {
  let people = await getAllPeople();
  let peopleDict = {};
  people.forEach(person => peopleDict[person.url] = person.name);
  let planets = await getAllPlanets();
  planets.forEach((planet) => {
    planet.residents = planet.residents.map((resident) => peopleDict[resident]);
  });
  res.send(planets);
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})