import React from 'react';
import { storiesOf, addDecorator } from '@storybook/react';
import { Provider } from 'react-redux';
import { configureStore } from '../src/config';
import { SignInComp, RoomsComp, RoomComp, UserListPopUp } from '../src/components';

const store = configureStore();

storiesOf('SignInComp', module)
    .add('with UI', () => <SignInComp />);

storiesOf('RoomsComp', module)
    .addDecorator(story => <Provider store={store}>{story()}</Provider>)
    .add('with UI', () => <RoomsComp />);

storiesOf('RoomComp', module)
    .addDecorator(story => <Provider store={store}>{story()}</Provider>)
    .add('with UI', () => <RoomComp />);

storiesOf('UserListPopUp', module)
    .addDecorator(story => <Provider store={store}>{story()}</Provider>)
    .add('with UI', () => <UserListPopUp />);
