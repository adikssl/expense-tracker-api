import { walletRepository } from "./wallet.repository";
import { CreateWalletInput, UpdateWalletInput } from "./wallet.types";

export const walletService = {
  async findWalletById(id: number, userId: number) {
    const wallet = await walletRepository.findWalletById(id);
    if (!wallet) {
      throw new Error(`Wallet with ${id} not found`);
    }
    if (wallet.userId !== userId) {
      throw new Error("Access denied");
    }
    return wallet;
  },
  async findWalletsByUserId(userId: number) {
    return await walletRepository.findWalletsByUserId(userId);
  },
  async createWallet(data: CreateWalletInput, userId: number) {
    let name = data.name;

    if (!name) {
      const existingWallets =
        await walletRepository.findWalletsByUserId(userId);
      name = `Мой кошелек ${existingWallets.length + 1}`;
    }

    return walletRepository.createWallet({ ...data, name }, userId);
  },
  async updateWallet(id: number, userId: number, data: UpdateWalletInput) {
    if (Object.keys(data).length === 0) {
      throw new Error("No fields provided to update");
    }
    await this.findWalletById(id, userId);
    return walletRepository.updateWallet({ ...data }, id);
  },
  async deleteWallet(id: number, userId: number) {
    await this.findWalletById(id, userId);
    return await walletRepository.deleteWallet(id);
  },
};
