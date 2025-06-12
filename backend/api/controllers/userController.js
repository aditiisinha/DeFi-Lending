import User from '../models/User.js';
import Invest from '../models/Invest.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
export const registerUser = async (req, res) => {
    try {
        const { username, fullname, email, password } = req.body;
        if (!username || !fullname || !email || !password) {
            return res.status(400).json({
                status: 'false',
                message: 'Please fill all fields'
            })
        }
        const existingEmail = await User.findOne({ email });
        if(existingEmail){
            return res.status(400).json({
                status: 'false',
                message: 'Email already exists'
            })  
        }
        const existingUsername = await User.findOne({userName:username});
        if(existingUsername){
            return res.status(400).json({
                status: 'false',
                message: 'Username already exists'
            })
        }
        const passwordHash = await bcrypt.hash(password, 12);
        const user = new User({
            userName: username,
            fullName: fullname,
            email,
            password: passwordHash
        })
        await user.save();
        res.status(201).json({
            status: 'success',
            message: 'User registered successfully'
        })
    }
    catch (err) {
        res.status(400).json({
            status: 'false',
            message: err.message
        })
    }
}

export const loginUser = async (req, res) => {
    try {
        const { usernameOrEmail, password } = req.body;
        if (!usernameOrEmail || !password) {
            throw new Error('Please fill all fields')
        }
        const user = await User.findOne({ $or: [{ userName: usernameOrEmail }, { email: usernameOrEmail }] });
        if (!user) {
            return res.status(400).json({
                status: 'false',
                message: 'User do not exist'
            })
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                status: 'false',
                message: 'Invalid Credentials'
            })
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '72h' });
        res.status(200).json({
            status: 'success',
            message: 'User logged in successfully',
            token
        })
    }
    catch (err) {
        res.status(400).json({
            status: 'false',
            message: err.message
        })
    }
}


export const deposit = async (req, res) => {
  const { amount } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.wallet += Number(amount);
    await user.save();

    res.status(200).json({ message: 'Deposit successful', balance: user.wallet });
  } catch (err) {
    res.status(500).json({ message: 'Deposit failed', error: err.message });
  }
}

export const borrowLoan = async (req, res) => {
  const { amount } = req.body;
  const userId = req.user.id;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: 'Invalid borrow amount' });
  }

  try {
    const user = await User.findById(userId);
    user.loan += Number(amount);
    user.wallet += Number(amount); // add borrowed money to wallet
    await user.save();

    res.status(200).json({
      message: `Borrowed $${amount} successfully`,
      balance: user.wallet,
      loan: user.loan,
    });
  } catch (err) {
    res.status(500).json({ message: 'Borrowing failed', error: err.message });
  }
};

// PAY LOAN
export const payLoan = async (req, res) => {
  const { amount } = req.body;
  const userId = req.user.id;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: 'Invalid payment amount' });
  }

  try {
    const user = await User.findById(userId);
    if (!user || user.wallet < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const actualPayment = Math.min(amount, user.loan);

    user.wallet -= actualPayment;
    user.loan -= actualPayment;
    await user.save();

    res.status(200).json({
      message: `Paid $${actualPayment} towards loan`,
      balance: user.wallet,
      loan: user.loan,
    });
  } catch (err) {
    res.status(500).json({ message: 'Loan payment failed', error: err.message });
  }
};

export const invest = async (req, res) => {
    try {
        const { coinName, amount, duration } = req.body;
        if (!coinName || !amount || !duration) {
            return res.status(400).json({
                status: 'false',
                message: 'Please fill all fields'
            })
        }
        const user = await User.findOne({ _id: req.user.id });
        if (!user) {
            return res.status(400).json({
                status: 'false',
                message: 'User do not exist'
            })
        }
        if (user.wallet < amount) {
            return res.status(400).json({
                status: 'false',
                message: 'Insufficient funds'
            })
        }
        user.wallet -= amount;
        await user.save();
        const invest = new Invest({
            userId: req.user.id,
            coinName,
            amount,
            duration
        })
        invest.save();
        return res.status(200).json({
            status: 'success',
            message: 'Investment successful'
        })
    }
    catch (err) {
        return res.status(400).json({
            status: 'false',
            message: err.message
        })
    }
};

// Add this to userController.js
export const getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const investments = await Invest.find({ userId: req.user.id });
    const cryptoInvestment = investments
      .filter(i => i.coinName)  // assuming all are crypto
      .reduce((acc, i) => acc + i.amount, 0);

    const restInvestment = 0; // Add logic if needed

    res.json({
      userName: user.fullName,     
      email: user.email,
      wallet: user.wallet,
      loan: user.loan,
      cryptoInvestment,
      restInvestment
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
