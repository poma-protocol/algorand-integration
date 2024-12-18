from algopy import ARC4Contract, String, UInt64, itxn, Global, Account, Txn, subroutine
from algopy.arc4 import abimethod


class Poma(ARC4Contract):
    def __init__(self) -> None:
        super().__init__()
        self.admin = Txn.sender
        
    @subroutine
    def _check_if_admin(self) -> None:
        assert(
            Txn.sender == self.admin
        ), "Only the account the cretor of the account can call this function"    
    
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
        # Should only be called by creator
        self._check_if_admin()
        
        # Send asset
        itxn.AssetTransfer(
            asset_amount=amount,
            asset_receiver=receiver,
            xfer_asset=asset_id,
            fee=Global.min_txn_fee
        ).submit()
        
    @abimethod
    def send_algo_reward(self, amount: UInt64, receiver: Account) -> None:
        # Should only be called by creator
        self._check_if_admin()
        
        # Send ALGOs
        itxn.Payment(
            amount=amount,
            receiver=receiver,
            fee=Global.min_txn_fee
        ).submit()
