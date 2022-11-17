import Cookies from "cookies";
import Cookie from "js-cookie";
import LitJsSdk from "lit-js-sdk";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";

export default function Protected(props) {
  const router = useRouter();
  return (
    <div>
      <main className={styles.main}>
        {props?.isAuthorized ? (
          <>
            <h1>Protected Page</h1>
            <h2>Voila 🎉🎉🥳🎉🎉</h2>
            <p>
              You are authorized to view this page. Since you possess the{" "}
              <a href="https://mumbai.polygonscan.com/address/0xB56946D84E4Dd277A8E575D5Dae551638010C6A8">
                Color Token NFT(CLRT)
              </a>
            </p>
          </>
        ) : (
          <>
            <h1>Protected Page</h1>
            <p>
              You are not authorized to view this page. Since you do not possess
              required{" "}
              <a
                target="_blank"
                rel="noreferrer"
                href="https://mumbai.polygonscan.com/address/0xB56946D84E4Dd277A8E575D5Dae551638010C6A8"
              >
                Color Token NFT(CLRT)
              </a>
              . Go and mint one from{" "}
              <a
                target="_blank"
                rel="noreferrer"
                href="http://color-marketplace.vercel.app/"
              >
                here
              </a>
            </p>
          </>
        )}
        {/* logout */}
        <button
          className={styles.button}
          onClick={() => {
            Cookie.set("lit-auth", "", { expires: 1 });
            router.push("/");
          }}
        >
          Logout
        </button>
      </main>
    </div>
  );
}

export const getServerSideProps = async ({ req, res }) => {
  const cookies = new Cookies(req, res);
  const jwt = cookies.get("lit-auth");
  if (!jwt) return { props: { isAuthorized: false } };

  const { verified, payload } = LitJsSdk.verifyJwt({ jwt });
  console.log("payload: ", payload, verified);
  if (!verified) return { props: { isAuthorized: false } };
  if (
    payload.path !== "/protected" ||
    payload.baseUrl !== "http://localhost:3000" ||
    payload.role !== "developer"
  )
    return { props: { isAuthorized: false } };
  return { props: { isAuthorized: true } };
};
