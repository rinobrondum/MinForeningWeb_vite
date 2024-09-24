// requires async function with state update when using

const getGrowthbookUrl = async () => {
    try {
      const response = await fetch('/paths/paths.json?q=' + Math.floor(Math.random() * 10000000).toString());
      const data = await response.json();

      if (localStorage.getItem("minOrganisation_growthBookUrl"))
      {
        return localStorage.getItem("minOrganisation_growthBookUrl");
      } else {
        return data.urls.growthBookUrl
      }
  } catch (error) {
    console.error('Error fetching or parsing JSON:', error);
  }}
  
  export default getGrowthbookUrl
  