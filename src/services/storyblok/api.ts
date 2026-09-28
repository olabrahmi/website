import { storyblokInit, apiPlugin } from '@storyblok/react/rsc';

import { componentsRegistry } from '@/utils/components-registry';

const getStoryblokApi = storyblokInit({
  accessToken: process.env.STORYBLOK_API_TOKEN,
  use: [apiPlugin],
  components: componentsRegistry,
  apiOptions: {
    cache: {
      type: 'memory',
      clear: 'auto',
    },
  },
});

export const initStoryblok = () => {
  getStoryblokApi();
};

export const storyblokApi = () => {
  try {
    return getStoryblokApi();
  } catch (error) {
    console.error(error);
    throw new Error('Error initializing Storyblok API');
  }
};
