const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');


describe('TransactionPool', () => {
  let tp, transaction, wallet;
  beforeEach( () => {
    tp = new TransactionPool();
    wallet = new Wallet();
    transaction = Transaction.newTransaction(wallet, 'rec134nt', 30);
    tp.updateOrAddTransaction(transaction);
    transaction = wallet.createTransaction('rec134nt', 30, tp);
  });

  it('取引台帳追加テスト', () => {
    expect(tp.transactions.find(t => t.id === transaction.id)).toEqual(transaction);
  });

  it('取引台帳更新テスト', () => {
    const oldTransaction = JSON.stringify(transaction);
    const newTransaction = transaction.update(wallet, 'foo-ew145');
    tp.updateOrAddTransaction(newTransaction);
    expect(JSON.stringify(tp.transactions.find(t => t.id === newTransaction.id)))
      .not.toEqual(oldTransaction);
  });

  describe('正常/不正混在テスト', () => {
    let validTransactions;
    beforeEach( () => {
      validTransactions = [...tp.transactions];
      for (let i = 0; i < 6; i++) {
        wallet = new Wallet();
        transaction = wallet.createTransaction('rec134nt', 30, tp);
        if (i%2 == 0) {
          transaction.input.amount = 99999
        } else {
          validTransactions.push(transaction);
        }
      }
    });

    it('取引台帳と妥当性検証取引リストテスト', () => {
      expect(JSON.stringify(tp.transactions)).not.toEqual(JSON.stringify(validTransactions))
    });

    it('妥当性検証取引リストテスト', () => {
      expect(tp.validTransactions()).toEqual(validTransactions)
    });
  });

  it('取引明細清算テスト', () => {
    tp.clear();
    expect(tp.transactions).toEqual([]);
  })
});