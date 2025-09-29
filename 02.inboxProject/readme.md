| **Aspect**                  | **Gas Limit**                                                                                          | **Gas Price**                                                                                    |
| --------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| **What it is**              | The **maximum number of gas units** you allow your transaction to consume.                             | The **amount of ETH you pay per gas unit**.                                                      |
| **Purpose**                 | Prevents your transaction from consuming infinite gas if something goes wrong (like an infinite loop). | Incentivizes miners/validators to prioritize your transaction (higher price = faster inclusion). |
| **Who sets it**             | You (or your wallet/provider estimates it for you).                                                    | You (or your wallet sets dynamically based on network demand).                                   |
| **Analogy**                 | Like the **size of your fuel tank** — max fuel you are willing to use.                                 | Like the **price per liter** you are willing to pay.                                             |
| **What happens if too low** | Transaction runs out of gas and fails (but you still pay for gas used).                                | Your transaction might be ignored for a long time if price is too low.                           |
| **Total Cost Formula**      | `Total Fee = Gas Used × Gas Price`                                                                     |                                                                                                  |



<!-- Example Calculation

Gas Limit = 10 → You allow a maximum of 10 units of gas.

Gas Price = 5 (wei or gwei) → You are willing to pay 5 per gas unit. -->