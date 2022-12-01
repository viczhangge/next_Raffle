import { ConnectButton } from "web3uikit";

export default function Header() {
  return (
    <div className="border-b-2 p-5 flex flex-row">
      <h1 className="px-4 py-4 font-blog text-3xl">Decentralized Raffle</h1>
      <div className="ml-auto px-2 py-4">
        <ConnectButton moralisAuth={false}>Connect</ConnectButton>
      </div>
    </div>
  );
}
