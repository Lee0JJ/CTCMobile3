import React, { useContext, useState, createContext } from 'react';

import { useAddress, useContract, useMetamask, useContractWrite, useContractRead } from '@thirdweb-dev/react-native';
import { ethers } from 'ethers';
import { calTotalTickets } from '../utils';

//IPFS URL
//import { useStorageUpload } from '@thirdweb-dev/react';

//AXIOS
import axios from 'axios';


const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract, isLoading } = useContract('0x57a16bA9144b76FD2a87cad6C8B17BC8393e6F0F');
  const { mutateAsync: createConcert, isLoading1 } = useContractWrite(contract, "createConcert")
  const { mutateAsync: createOrganizer, isLoading2 } = useContractWrite(contract, "registerAsOrganizer")

  const address = useAddress();
  //const connect = useMetamask();

  //IPFS URL === START
  const [file, setFile] = useState([]);
  const [uploadUrls, setUploadUrls] = useState('');
  //const { mutateAsync: upload } = useStorageUpload();

  // const uploadToIpfs = async (file) => {
  //   const uploadUrl = await upload({
  //     data: [file],
  //     options: {
  //       uploadWithGatewayUrl: true,
  //       uploadWithoutDirectory: false
  //     }
  //   });
  //   return uploadUrl;
  // };
  //IPFS URL === END

  const publishCampaign = async (form) => {
    try {
      console.log('form:', form);
      const numConcert = await contract.call('numConcerts');

      // Format zoneInfo as a 2D array of uint256
      const zoneInfo = form.zoneInfo.map(row => [
        ethers.BigNumber.from(row.price),
        ethers.BigNumber.from(row.seatAmount)
      ]);

      // console.log('form.numConcert:', numConcert.toNumber());
      // console.log('form.name:', form.name);
      // console.log('form.date:', convertDatetimeToUint256(form.date));
      // console.log('form.venue:', form.venue);
      // console.log('form.numZone:', ethers.BigNumber.from(form.numZone));
      // console.log('form.zoneInfo:', zoneInfo);
      // console.log('form.image:', form.image);
      // console.log('form.imageURL', await uploadToIpfs(form.image));

      //Set ImageUrls by the uploaded image
      //const imageUrls = await uploadToIpfs(form.image);

      console.log('imageUrls:', imageUrls);

      // const data = await createConcert({
      //   args: [
      //     numConcert.add(ethers.BigNumber.from(1)),
      //     form.name,
      //     convertDatetimeToUint256(form.date),
      //     form.venue,
      //     ethers.BigNumber.from(form.zoneInfo.length),
      //     zoneInfo,
      //     imageUrls
      //   ],
      // });

      console.log("contract call success");

      //create form for axios
      const concert = {
        organizerid: await getConcertOwnerId(address),
        name: form.name,
        owner: address,
        venue: form.venue,
        description: form.description,
        category: 'none',
        createdDate: new Date().toISOString().slice(0, -1),
        conductedDate: form.date,
        numZone: form.zoneInfo.length,
        zoneinfo: JSON.stringify(form.zoneInfo),
        totalSeat: calTotalTickets(form.zoneInfo),
        imgurl: imageUrls
      }

      await axios.post("http://localhost:8800/concert", concert);

      console.log("axios call success");

    } catch (error) {
      console.log("contract call failure", error)
    }
  }

  const updateCampaign = async (form) => {
    try {
      console.log('form:', form);
      // Format zoneInfo as a 2D array of uint256
      const zoneInfo = form.zoneInfo.map(row => [
        ethers.BigNumber.from(row.price),
        ethers.BigNumber.from(row.seatAmount)
      ]);

      // console.log('form.concertId:', numConcert.toNumber());
      // console.log('form.name:', form.name);
      // console.log('form.date:', convertDatetimeToUint256(form.date));
      // console.log('form.venue:', form.venue);
      // console.log('form.numZone:', ethers.BigNumber.from(form.numZone));
      // console.log('form.zoneInfo:', zoneInfo);
      // console.log('form.image:', form.image);
      // console.log('form.imageURL', await uploadToIpfs(form.image));

      //const imageUrls = await uploadToIpfs(form.image);

      // const data = await createConcert({
      //   args: [
      //     ethers.BigNumber.from(form.concertId),
      //     form.name,
      //     convertDatetimeToUint256(form.date),
      //     form.venue,
      //     ethers.BigNumber.from(form.numZone),
      //     zoneInfo,
      //     imageUrls
      //   ],
      // });

      // console.log("contract call success", data)

      //update form for axios
      const concert = {
        organizerid: await getConcertOwnerId(address),
        name: form.name,
        owner: address,
        venue: form.venue,
        description: form.description,
        category: 'none',
        createdDate: new Date().toISOString().slice(0, -1),
        conductedDate: form.date,
        numZone: form.zoneInfo.length,
        zoneinfo: JSON.stringify(form.zoneInfo),
        totalSeat: calTotalTickets(form.zoneInfo),
        imgurl: imageUrls
      }
      console.log("update concert:", form.concertId)
      await axios.put(`http://localhost:8800/concert/${form.concertId}`, concert);

    } catch (error) {
      console.log("contract call failure", error)
    }
  }


  const getCampaigns = async () => {
    //const campaigns = await useContractRead(contract, "getConcerts", []).catch(error => console.log("Error fetching campaigns:", error));
    const campaigns = await contract.call('getConcerts');
    //console.log(campaigns);
    const parsedCampaigns = campaigns.map((campaign, i) => {
      const zoneInfo = campaign.zoneInfo.map(row => ({
        price: row[0].toNumber(),
        seatAmount: row[1].toNumber()
      }));

      return {
        cId: campaign.concertId.toNumber(),
        owner: campaign.owner,
        name: campaign.name,
        venue: campaign.venue, // Convert to string
        numZones: campaign.numZones.toNumber(),
        zoneInfo: zoneInfo,
        date: campaign.date.toNumber(),
        image: campaign.imageUrl,
        pId: i
      };

    });
    //console.log(JSON.stringify(parsedCampaigns, null, 2));
    return parsedCampaigns;
  }

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();

    const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address);

    return filteredCampaigns;
  }

  const getConcertOwnerId = async (address) => {
    // Get concert's owner organizer id
    const organizer = await getOrganizer();

    //find organizer id by their address
    const organizerId = organizer.find((organizer) => organizer.account === address).oId;

    return organizerId;
  }

  const donate = async (pId, amount) => {
    const data = await contract.call('donateToCampaign', [pId], { value: ethers.utils.parseEther(amount) });

    return data;
  }

  const purchaseTickets = async (uniqueId, concertId, zoneId, numTickets, amount) => {
    const data = await contract.call('purchaseTickets', [uniqueId, concertId, zoneId, numTickets], { value: ethers.utils.parseEther(amount)});

    return data;
  }

  const getDonations = async (pId) => {
    const donations = await contract.call('getDonators', [pId]);
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];

    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString())
      })
    }

    return parsedDonations;
  }

  const applyOrganizer = async (form) => {
    try {
      const numOrg = await contract.call('numOrganizers');

      // console.log('form.numOrg:', numOrg.toNumber());
      // console.log('form.name:', form.name);
      // console.log('form.document:', form.document);
      // console.log('form.image:', await uploadToIpfs(form.document));

      //const imageUrls = await uploadToIpfs(form.document);

      // const data = await createOrganizer({
      //   args: [
      //     form.name,
      //     imageUrls
      //   ],
      // });

      // console.log("contract call success", data)

      //create form for axios
      const organizer = {
        name: form.name,
        email: form.email,
        account: address,
        documenturl: imageUrls,
        isverified: false,
        isarchived: false
      }

      await axios.post("http://localhost:8800/organizer", organizer);


    } catch (error) {
      console.log("contract call failure", error)
    }
  }

  const getOrganizer = async () => {
    //const { data, isLoading } = useContractRead(contract, "viewAllOrganizers", [onlyVerified, includeArchived])
    const data = await contract.call('getOrganizers');
    const parsedOrganizer = data.map((organizer, i) => ({
      oId: organizer.organizerId.toNumber(),
      account: organizer.account,
      name: organizer.name,
      documentUrl: organizer.documentUrl,
      isVerified: organizer.isVerified,
      isArchived: organizer.isArchived,
      pId: i
    }));

    return parsedOrganizer;
  }


  const updateOrganizer = async (form) => {
    console.log("updateOrganizer", form)

    //const imageUrls = await uploadToIpfs(form.documentUrl);

    try {
      const data = await contract.call('updateOrganizer', [
        ethers.BigNumber.from(form.oId),
        form.name,
        address,
        imageUrls,
        form.isVerified,
        form.isArchived
      ]);

      console.log("contract call success", data)

      //update form for axios
      const organizer = {
        oId: form.oId,
        name: form.name,
        email: form.email,
        account: address,
        documenturl: imageUrls,
        isverified: form.isVerified,
        isarchived: form.isArchived
      }

      await axios.put("http://localhost:8800/organizer", organizer);

    } catch (error) {
      console.log("contract call failure", error)
    }
  }

  const archiveOrganizer = async (organizerId) => {
    try {
      // const data = await contract.call('archiveOrganizer', [
      //   organizerId
      // ]);

      // console.log("contract call success", data)

      //update form for axios
      const organizer = {
        isArchived: true
      }

      console.log("archiveOrganizer", organizerId)
      await axios.put(`http://localhost:8800/organizer/${organizerId}`, organizer);

    } catch (error) {
      console.log("contract call failure", error)
    }
  }

  const setOrganizerStatus = async (organizerId, isVerified) => {
    try {
      // const data = await contract.call('setOrganizerVerificationStatus', [
      //   organizerId, isVerified
      // ]);

      // console.log("contract call success", data)

      //update form for axios
      const organizer = {
        IsVerified: isVerified
      }

      console.log("setOrganizerStatus", organizerId)
      await axios.put(`http://localhost:8800/organizer/${organizerId}`, organizer);

    } catch (error) {
      console.log("contract call failure", error)
    }
  }


  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        //connect,
        createCampaign: publishCampaign,
        updateCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
        applyOrganizer,
        getOrganizer,
        updateOrganizer,
        archiveOrganizer,
        setOrganizerStatus,
        purchaseTickets
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext);