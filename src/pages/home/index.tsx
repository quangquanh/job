import { Divider } from "antd";
import styles from "styles/client.module.scss";
import SearchClient from "@/components/client/search.client";
import JobCard from "@/components/client/card/job.card";
import CompanyCard from "@/components/client/card/company.card";
import { useState } from "react";

const HomePage = () => {
  const [keyword, setKeyword] = useState("");
  const [skill, setSkill] = useState("");
  const [address, setAddress] = useState("");

  return (
    <div className={`${styles["container"]} ${styles["home-section"]}`}>
      <div className="search-content" style={{ marginTop: 20 }}>
        <SearchClient
          setKeyword={setKeyword}
          setSkill={setSkill}
          setAddress={setAddress}
        />
      </div>
      <Divider />
      <CompanyCard keyword={keyword} />
      <div style={{ margin: 50 }}></div>
      <Divider />
      <JobCard keyword={keyword} skill={skill} address={address} />
    </div>
  );
};

export default HomePage;
