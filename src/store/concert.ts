import { create } from 'zustand';
import { produce } from 'immer';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAddress, useContract, useContractWrite, useContractRead, useStorageUpload } from '@thirdweb-dev/react-native';
import { ethers } from 'ethers';
import { EditionMetadataWithOwnerOutputSchema } from '@thirdweb-dev/sdk';
import { calTotalTickets } from '../utils';

import React, { useState } from 'react';

export const useConcert = create(
  persist(
    (set, get) => ({
      ConcertList: [],
      FavoritesList: [],
      TicketList: [],
    }),
    {
      name: 'concert',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

