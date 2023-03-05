import React from "react";

import { DoDecrypt } from "../../../services/aes.service";
const Message = ({ data }: any) => {
  return <>{data && DoDecrypt(data)}</>;
};

export default Message;
