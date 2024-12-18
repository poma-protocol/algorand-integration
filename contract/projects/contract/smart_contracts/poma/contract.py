from algopy import ARC4Contract, String, UInt64, itxn, Global, Account
from algopy.arc4 import abimethod


class Poma(ARC4Contract):
    @abimethod()
    def hello(self, name: String) -> String:
        return "Hello, " + name
    
    @abimethod()
    def opt_in(self, assetID: UInt64) -> None:
        # Opt in to an asset
        itxn.AssetTransfer(
            asset_amount=0,
            asset_receiver=Global.current_application_address,
            xfer_asset=assetID,
            fee=Global.min_txn_fee
        ).submit()
        
    @abimethod
    def send_reward(self, amount: UInt64, receiver: Account, asset_id: UInt64) -> None:
        # Send asset
        itxn.AssetTransfer(
            asset_amount=amount,
            asset_receiver=receiver,
            xfer_asset=asset_id,
            fee=Global.min_txn_fee
        ).submit()
        
    @abimethod
    def send_algo_reward(self, amount: UInt64, receiver: Account) -> None:
        # Send ALGOs
        itxn.Payment(
            amount=amount,
            receiver=receiver,
            fee=Global.min_txn_fee
        ).submit()
