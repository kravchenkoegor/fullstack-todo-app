import { shallowMount } from '@vue/test-utils';
import Homepage from './Home.vue';

describe('Homepage unit test', () => {
  const wrapper = shallowMount(Homepage);

  it('Header exists', () => {
    expect(wrapper.find('nav.navbar').exists()).toBeTruthy();
  });

  it('Header text is Todo app', () => {
    expect(wrapper.find('a.navbar-brand').text()).toEqual('Todo app');
  });

  wrapper.destroy();
});
