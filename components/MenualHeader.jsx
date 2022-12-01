import { useEffect } from "react";
import { useMoralis } from "react-moralis";

export default function MenualHeader() {
  const {
    Moralis,
    enableWeb3,
    account,
    isWeb3Enabled,
    deactivateWeb3,
    isWeb3EnableLoading,
  } = useMoralis();

  useEffect(() => {
    if (isWeb3Enabled) return;
    if (typeof window != "undefined") {
      if (window.localStorage.getItem("connected")) {
        enableWeb3();
      }
    }
    //
  }, [isWeb3Enabled]);

  useEffect(() => {
    Moralis.onAccountChanged((account) => {
      console.log(`the account changged to ${account}`);
      if (account == null) {
        if (typeof window != "undefined") {
          window.localStorage.removeItem("connected");
        }
        deactivateWeb3();
        console.log("null account found");
      }
    });
  }, []);

  return (
    <div>
      {account ? (
        <div>
          Connected to {account.slice(0, 6)}....
          {account.slice(account.length - 4)}
        </div>
      ) : (
        <button
          onClick={async () => {
            await enableWeb3();
            if (typeof window != "undefined") {
              window.localStorage.setItem("connected", "Inject");
            }
          }}
          disabled={isWeb3EnableLoading}
        >
          Connect
        </button>
      )}
    </div>
  );
}
