import { useWeb3Contract } from "react-moralis";
import { abi, contractAddress } from "../constants";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";

export default function LotterEntrance() {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const [entranceFee, setEntranceFee] = useState("0");
  const [numOfPlayers, setNumOfPlayers] = useState("0");
  const [currentWinner, setCurrentWinner] = useState("0");
  const [raffleBalance, setRaffleBalance] = useState("0");

  const dispatch = useNotification();

  const raffleContract =
    chainId in contractAddress ? contractAddress[chainId][0] : null;

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleContract,
    functionName: "getEntranceFee",
    params: {},
  });

  const { runContractFunction: getNumOfPlayers } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleContract,
    functionName: "getNumOfPlayers",
    params: {},
  });

  const { runContractFunction: getCurrentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleContract,
    functionName: "getCurrentWinner",
    params: {},
  });

  const {
    runContractFunction: enterRaffleFee,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleContract,
    functionName: "enterRaffleFee",
    params: {},
    msgValue: entranceFee,
  });

  const { runContractFunction: getBalance } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleContract,
    functionName: "getBalance",
    params: {},
  });

  const handleSuccess = async function (tx) {
    await tx.wait(1);
    handleNewNotificaiton(tx);
    updateUI();
  };

  const handleNewNotificaiton = () => {
    dispatch({
      type: "success",
      title: "Tx notification",
      message: "transaction complete",
      position: "topR",
      icon: "bell",
    });
  };

  async function updateUI() {
    const feeFromContract = (await getEntranceFee()).toString();
    setEntranceFee(feeFromContract);
    const numOfPlayersFromCall = (await getNumOfPlayers()).toString();
    setNumOfPlayers(numOfPlayersFromCall);
    const currentWinnerFromCall = (await getCurrentWinner()).toString();
    setCurrentWinner(currentWinnerFromCall);
    const raffleBalcnaceFromCall = (await getBalance()).toString();
    setRaffleBalance(raffleBalcnaceFromCall);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);
  return (
    <div className="px-5">
      hi this is the raffle
      {raffleContract ? (
        <div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white ml-auto py-2  px-4 rounded-full font-bold"
            onClick={async () => {
              await enterRaffleFee({
                onSuccess: handleSuccess,
                onError: (error) => {
                  console.error(error);
                },
              });
            }}
            disabled={isFetching || isLoading}
          >
            {isFetching || isLoading ? (
              <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
            ) : (
              <div>Enter Raffle</div>
            )}
          </button>
          <div>
            enter the raffle entrance Fee:
            {ethers.utils.formatEther(entranceFee, "ethers")} ETH
          </div>
          <div>Number of player: {numOfPlayers}</div>
          <div>currentWinner: {currentWinner}</div>
          <div>
            raffleBalance: {ethers.utils.formatEther(raffleBalance, "ethers")}
          </div>
        </div>
      ) : (
        <div>Please connect to a supported chain</div>
      )}
    </div>
  );
}
