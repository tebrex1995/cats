const fetch = require('node-fetch');
const baseUrl = 'http://localhost:8080';

//Pack fetching base url in a function
const getDataFromApi = async endPoint => {
  const data = await fetch(`${baseUrl}${endPoint}`);
  return data.json();
};

//Get an user
const getUser = async userID => {
  return await getDataFromApi(`/users/${userID}`);
};

//Removes cat by key/value placed inside as parametars and returns array without that cat
const removeCat = async (arr, key, value) => {
  const newCatsArr = [];
  for (const cat of await arr) {
    if ((await cat[key]) !== value) {
      await newCatsArr.push(cat);
    }
  }
  return newCatsArr;
};

// Removes cat if an object has a key
const removeCatKey = async (arr, key) => {
  const oneMoreCatOut = [];
  for (const cat of arr) {
    //Check if cat object has a key and pushes it in an array
    if (!cat.hasOwnProperty(key)) {
      await oneMoreCatOut.push(cat);
    }
  }
  return await oneMoreCatOut;
};
//Declare type of values in object, neets to take an array from backend ( ne znam samo da li inicijalni ili finalni :D )
const declareTypeOfValues = async arr => {
  const arrayOfKeys = [];
  await Promise.all(
    arr.map(async data => {
      for (const key in data) {
        arrayOfKeys.push(await typeof data[key]);
      }
    })
  );
  return await arrayOfKeys;
};

//Main function for famous cats
//GetCats using for each with async
//https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404
//For each function custom made to adapt to async
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
const getCats = async user => {
  const catsImgUrl = [];
  const catsArr = [];
  await asyncForEach(user.cats, async catId => {
    const catObject = await getDataFromApi(`/cats/${catId}`);
    catsArr.push(catObject);
    //Push image in the array of the urls
    catsImgUrl.push(catObject['imageUrl']);
  });
  // const catsArr = Promise.all(
  //   await user.cats.map(async catId => {
  //     return await getDataFromApi(`/cats/${catId}`);
  //   })
  // );

  //Calls declareTypeValues function that taks arr as input and prints its datatype.
  // It takes removeCatKey arr as an input that removes a cat that contains arr and key that is passed as an argument
  // , and that arguments arr is a function remove cat that takes arr,key and value of cat object that removes that cat from an array
  return [
    await declareTypeOfValues(
      await removeCatKey(await removeCat(catsArr, 'name', 'Fluffykins'), 'type')
    ),
    //Return array of cats image urls
    await catsImgUrl,
  ];
};

//Modified readData function so it prints separately result for assignments 1-6 and assignment 7
const readData = async () => {
  const catData = await getCats(await getUser('123'));
  for (const result of catData) {
    console.log(await result);
  }
};

readData();

//Separate function to fetch cats and return their image urls
const fetchCats = async user => {
  const catsImgArr = [];
  await asyncForEach(user.cats, async catId => {
    const catObject = await getDataFromApi(`/cats/${catId}`);
    await catsImgArr.push(catObject.imageUrl);
  });
  return await catsImgArr;
};
const readData2 = async () => {
  const catData = await fetchCats(await getUser('123'));
  console.log(await catData);
};

// readData2();
