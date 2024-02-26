import { MouseEventHandler } from "react";

export interface ErrorObject {
  error: {
    data: {
      message: string
    }
  }
  // Add other expected properties if applicable
}
