//-------INFO--------//

/*
For the integration of the API with our application, it's essential that the API provides the following data structure to ensure seamless functionality:

Title and Tagline: The API should return data for each of the 13 titles used in our application, along with a corresponding tagline that succinctly describes the purpose or functionality of each module.

Pricing Information: The API needs to provide pricing information associated with each module. This pricing data should be dynamic and dependent on the subscription status of the user. Different pricing tiers should be available based on subscription plans, such as basic, premium, etc.

Subscription Status: The API must include data regarding the subscription status of the user for each module. This status should indicate whether the module is installed, not installed, or paused for the user's subscription plan. It could be represented as numerical values (e.g., 1 for installed, 2 for not installed, 3 for paused) or as descriptive strings.

Consistency with i18n Library: If internationalization (i18n) is implemented in our application, the API should be compatible with the i18next library or any other internationalization framework used. This ensures that any text or labels returned by the API can be easily localized and displayed in different languages as per user preferences.

By providing these essential data points, the API will enable our application to effectively render module information, including taglines, pricing details, and subscription statuses, ensuring a seamless user experience across different subscription plans.
*/

//------------------//

//simulated data-fetching. The tagline and the price is used in the DynamicModule. The status is both used in the ModulesContainer and in the DynamicModule
import i18next from 'i18next';

const fetchData = async (title) => {

    await new Promise(resolve => setTimeout(resolve, 1000));
  
    let simulatedData = [];

    {/* {the status refers to the status of the clients module. 1: client has installed the module, 2: client has not installed the module, 3: The module is installed but Paused} */}

    if (title === i18next.t('Medlemmer')) {
      simulatedData = [
        { id: 1, tagline: 'Muliggør effektiv medlems-administration og engagement', price: 'Modulet er en del af dit abonnement.', status: 1 },
      ];
    } else if (title === i18next.t('Aktiviteter')) {
      simulatedData = [
        { id: 1, tagline: 'Oplev letheden ved planlægning og administration af aktiviteter', price: 'Enhedspris 200,00 DKK/md ekskl moms.', status: 2 },
      ];
    } else if (title === i18next.t('Chat')){
      simulatedData = [
        { id: 1, tagline: 'Oplev udvidede kommunikations-muligheder og administrativ støtte', price: 'Enhedspris 200,00 DKK/md ekskl moms.', status: 3 },
      ];
    } else if (title === i18next.t('Bookinger')) {
      simulatedData = [
        { id: 1, tagline: 'Gør det muligt for dine medlemmer at booke på egen hånd', price: 'Modulet er en del af dit abonnement.', status: 1 },
      ];
    }
    else if (title === i18next.t('Dashboard')) {
      simulatedData = [
        { id: 1, tagline: 'Muliggør effektiv kommunikation og fællesskab', price: 'Modulet er en del af dit abonnement.', status: 1 },
      ];
    }
    return simulatedData;
  };
  
  export default fetchData;
  