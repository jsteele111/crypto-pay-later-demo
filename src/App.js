// src/App.js
import React, { useState, useRef, useEffect } from "react";
import { CandleChart } from "./CandleChart";
import "./App.css";

// PayLaterWorkflow Component
const PayLaterWorkflow = ({ currentPrice }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    tradingPair: 'BTC/USDC',
    direction: 'Sell',
    amount: '',
    paymentPeriod: '14 days'
  });
  const [tradeAmount, setTradeAmount] = useState('0.28872549');
  const [settlementPrice, setSettlementPrice] = useState(null);

  // Helper function to get the correct currency based on direction and trading pair
  const getTransferCurrency = () => {
    const [baseCurrency, quoteCurrency] = formData.tradingPair.split('/');
    return formData.direction === 'Sell' ? baseCurrency : quoteCurrency;
  };

  const getDaysFromPeriod = (period) => {
    const match = period.match(/(\d+)/);
    return match ? parseInt(match[1]) : 14;
  };

  // Calculate values based on form data
  const calculateValues = () => {
    const amount = parseFloat(formData.amount) || 1.5;
    const days = getDaysFromPeriod(formData.paymentPeriod);
    
    // Formula: amount / (15% + ((0.9%/7) * number of days to repayment) * (1-15%))
    const depositRate = 0.15;
    const dailyRate = 0.009 / 7;
    const totalPayment = amount / (depositRate + (dailyRate * days * (1 - depositRate)));
    
    // Formula: 15% * total payment amount
    const depositAmount = depositRate * totalPayment;
    
    // Formula: (total payment amount - deposit amount) * (0.9%/7) * number of days to repayment
    const transactionFee = (totalPayment - depositAmount) * dailyRate * days;
    
    return {
      totalPayment: totalPayment.toFixed(8),
      depositAmount: depositAmount.toFixed(8),
      transactionFee: transactionFee.toFixed(8),
      // Formatted versions with commas
      totalPaymentFormatted: parseFloat(totalPayment.toFixed(8)).toLocaleString(undefined, { minimumFractionDigits: 8, maximumFractionDigits: 8 }),
      depositAmountFormatted: parseFloat(depositAmount.toFixed(8)).toLocaleString(undefined, { minimumFractionDigits: 8, maximumFractionDigits: 8 }),
      transactionFeeFormatted: parseFloat(transactionFee.toFixed(8)).toLocaleString(undefined, { minimumFractionDigits: 8, maximumFractionDigits: 8 })
    };
  };

  const { totalPaymentFormatted, depositAmountFormatted, transactionFeeFormatted } = calculateValues();
  const walletAddress = "daDR23762309fDGhfjalf68dd983753FD2";
  // Use the current price from the chart, with fallback
  const livePrice = currentPrice || 2856.42;

  const openModal = () => {
    setIsModalOpen(true);
    setCurrentStep(1);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentStep(1);
  };

  const nextStep = () => {
    if (formData.amount && parseFloat(formData.amount) > 0) {
      setCurrentStep(2);
    } else {
      alert('Please enter a valid amount');
    }
  };

  const goToConfirmation = () => {
    // Capture the current live price as fixed settlement price
    setSettlementPrice(livePrice);
    setCurrentStep(3);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Wallet address copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy. Please copy manually.');
    });
  };

  const calculateStep2Values = () => {
    const amount = parseFloat(tradeAmount) || 0.28872549;
    const days = getDaysFromPeriod(formData.paymentPeriod);
    
    // Formula: amount / (15% + ((0.9%/7) * number of days to repayment) * (1-15%))
    const depositRate = 0.15;
    const dailyRate = 0.009 / 7;
    const totalPayment = amount / (depositRate + (dailyRate * days * (1 - depositRate)));
    
    // Formula: 15% * total payment amount
    const depositAmount = depositRate * totalPayment;
    
    // Formula: (total payment amount - deposit amount) * (0.9%/7) * number of days to repayment
    const transactionFee = (totalPayment - depositAmount) * dailyRate * days;
    
    return {
      totalPayment: totalPayment.toFixed(8),
      depositAmount: depositAmount.toFixed(8),
      transactionFee: transactionFee.toFixed(8),
      // Formatted versions with commas
      totalPaymentFormatted: parseFloat(totalPayment.toFixed(8)).toLocaleString(undefined, { minimumFractionDigits: 8, maximumFractionDigits: 8 }),
      depositAmountFormatted: parseFloat(depositAmount.toFixed(8)).toLocaleString(undefined, { minimumFractionDigits: 8, maximumFractionDigits: 8 }),
      transactionFeeFormatted: parseFloat(transactionFee.toFixed(8)).toLocaleString(undefined, { minimumFractionDigits: 8, maximumFractionDigits: 8 })
    };
  };

  const calculateConfirmationValues = () => {
    const amount = parseFloat(tradeAmount) || 0.28872549;
    const days = getDaysFromPeriod(formData.paymentPeriod);
    
    // Formula: amount / (15% + ((0.9%/7) * number of days to repayment) * (1-15%))
    const depositRate = 0.15;
    const dailyRate = 0.009 / 7;
    const totalPayment = amount / (depositRate + (dailyRate * days * (1 - depositRate)));
    
    // Formula: 15% * total payment amount
    const depositAmount = depositRate * totalPayment;
    
    // Formula: (total payment amount - deposit amount) * (0.9%/7) * number of days to repayment
    const transactionFee = (totalPayment - depositAmount) * dailyRate * days;
    
    // Remaining payment due = overall payment amount - 15% deposit amount
    const remainingPayment = totalPayment - depositAmount;
    
    // Use fixed settlement price instead of live price
    const fixedSettlementPrice = settlementPrice || livePrice;
    
    // Total asset to be received calculation based on trade direction
    const [baseCurrency, quoteCurrency] = formData.tradingPair.split('/');
    let totalAssetReceived, receivedCurrency;
    
    if (formData.direction === 'Buy') {
      // Buy: overall payment amount / asset settlement price, receive base currency
      totalAssetReceived = totalPayment / fixedSettlementPrice;
      receivedCurrency = baseCurrency;
    } else {
      // Sell: overall payment amount * asset settlement price, receive quote currency
      totalAssetReceived = totalPayment * fixedSettlementPrice;
      receivedCurrency = quoteCurrency;
    }
    
    return {
      totalPayment: totalPayment.toFixed(8),
      depositAmount: depositAmount.toFixed(8),
      transactionFee: transactionFee.toFixed(8),
      remainingPayment: remainingPayment.toFixed(8),
      totalAssetReceived: totalAssetReceived.toFixed(8),
      receivedCurrency,
      // Get the currency for payment calculations
      paymentCurrency: getTransferCurrency(),
      settlementPrice: parseFloat(fixedSettlementPrice.toFixed(2)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      // Formatted versions with commas
      totalPaymentFormatted: parseFloat(totalPayment.toFixed(8)).toLocaleString(undefined, { minimumFractionDigits: 8, maximumFractionDigits: 8 }),
      depositAmountFormatted: parseFloat(depositAmount.toFixed(8)).toLocaleString(undefined, { minimumFractionDigits: 8, maximumFractionDigits: 8 }),
      transactionFeeFormatted: parseFloat(transactionFee.toFixed(8)).toLocaleString(undefined, { minimumFractionDigits: 8, maximumFractionDigits: 8 }),
      remainingPaymentFormatted: parseFloat(remainingPayment.toFixed(8)).toLocaleString(undefined, { minimumFractionDigits: 8, maximumFractionDigits: 8 }),
      totalAssetReceivedFormatted: parseFloat(totalAssetReceived.toFixed(8)).toLocaleString(undefined, { minimumFractionDigits: 8, maximumFractionDigits: 8 })
    };
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={openModal}
        style={{
          backgroundColor: "#FF4AE2",
          color: "#fff",
          border: "none",
          padding: "16px 36px",
          fontSize: "18px",
          borderRadius: "8px",
          cursor: "pointer",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          transition: "all 0.2s ease"
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = "#E63BCC"}
        onMouseLeave={(e) => e.target.style.backgroundColor = "#FF4AE2"}
      >
        Pay Later
      </button>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto',
            overflowX: 'hidden',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            
            {/* Step 1: Trade Setup */}
            {currentStep === 1 && (
              <div style={{ padding: '24px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '24px',
                  borderBottom: '1px solid #eee',
                  paddingBottom: '16px'
                }}>
                  <div style={{ flex: 1 }}></div>
                  <h2 style={{ margin: 0, color: '#1652F0', fontSize: '24px', textAlign: 'center' }}>
                    Pay later with MiDA
                  </h2>
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={closeModal}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '24px',
                        cursor: 'pointer',
                        color: '#666',
                        padding: '4px',
                        borderRadius: '4px'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      ×
                    </button>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    What asset trading pair are you interested in?
                  </label>
                  <select
                    value={formData.tradingPair}
                    onChange={(e) => handleInputChange('tradingPair', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '16px',
                      boxSizing: 'border-box',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="BTC/USDC">BTC/USDC</option>
                    <option value="ETH/USDC">ETH/USDC</option>
                    <option value="ETH/BTC">ETH/BTC</option>
                  </select>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Do you want to buy or sell this trading pair?
                  </label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {['Buy', 'Sell'].map(option => (
                      <button
                        key={option}
                        onClick={() => handleInputChange('direction', option)}
                        style={{
                          flex: 1,
                          padding: '12px',
                          border: `2px solid ${formData.direction === option ? '#1652F0' : '#ddd'}`,
                          backgroundColor: formData.direction === option ? '#f0f4ff' : 'white',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '16px',
                          color: formData.direction === option ? '#1652F0' : '#333',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    How long do you want to wait until repayment?
                  </label>
                  <select
                    value={formData.paymentPeriod}
                    onChange={(e) => handleInputChange('paymentPeriod', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '16px',
                      boxSizing: 'border-box',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="1 day">1 day</option>
                    <option value="2 days">2 days</option>
                    <option value="7 days">7 days</option>
                    <option value="14 days">14 days</option>
                    <option value="28 days">28 days</option>
                  </select>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    How much {getTransferCurrency()} would you like to transfer?
                  </label>
                  <input
                    type="text"
                    value={formData.amount}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow only numbers and one decimal point with up to 8 decimal places
                      if (/^\d*\.?\d{0,8}$/.test(value) || value === '') {
                        handleInputChange('amount', value);
                      }
                    }}
                    placeholder="Amount here"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Deposit & Fee Calculator */}
                <div style={{
                  backgroundColor: '#f8f9fa',
                  padding: '20px',
                  borderRadius: '8px',
                  marginBottom: '24px'
                }}>
                  <h3 style={{ margin: '0 0 16px 0', color: '#1652F0' }}>
                    Deposit & fee calculator
                  </h3>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>Your total payment would be</span>
                    <span style={{ fontWeight: 'bold' }}>{totalPaymentFormatted} {getTransferCurrency()}</span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>Your 15% deposit amount would be</span>
                    <span style={{ fontWeight: 'bold' }}>{depositAmountFormatted} {getTransferCurrency()}</span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <span>MiDA transaction fee is</span>
                    <span style={{ fontWeight: 'bold' }}>{transactionFeeFormatted} {getTransferCurrency()}</span>
                  </div>

                  <div style={{ marginBottom: '12px', fontSize: '14px', color: '#333' }}>
                    Transfer your funds to this address:
                  </div>

                  <div style={{
                    backgroundColor: 'white',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #ddd',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px'
                  }}>
                    <div style={{ 
                      fontFamily: 'monospace', 
                      fontSize: '12px', 
                      wordBreak: 'break-all',
                      overflowWrap: 'anywhere',
                      color: '#1652F0',
                      flex: 1,
                      lineHeight: '1.2',
                      maxWidth: '100%'
                    }}>
                      {walletAddress}
                    </div>
                    <div 
                      onClick={() => copyToClipboard(walletAddress)}
                      style={{
                        fontSize: '16px',
                        color: '#1652F0',
                        cursor: 'pointer',
                        flexShrink: 0,
                        padding: '2px',
                        borderRadius: '4px'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f4ff'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                      title="Copy address"
                    >
                      📋
                    </div>
                  </div>
                </div>

                <button
                  onClick={nextStep}
                  disabled={!formData.amount || parseFloat(formData.amount) <= 0}
                  style={{
                    width: '100%',
                    backgroundColor: (!formData.amount || parseFloat(formData.amount) <= 0) ? '#ccc' : '#1652F0',
                    color: 'white',
                    border: 'none',
                    padding: '16px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    cursor: (!formData.amount || parseFloat(formData.amount) <= 0) ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold',
                    transition: 'background-color 0.2s ease'
                  }}
                >
                  I've made my transfer
                </button>
              </div>
            )}

            {/* Step 2: Transfer Confirmation */}
            {currentStep === 2 && (
              <div style={{ padding: '24px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px',
                  borderBottom: '1px solid #eee',
                  paddingBottom: '12px'
                }}>
                  <div style={{ flex: 1 }}></div>
                  <h2 style={{ margin: 0, color: '#1652F0', fontSize: '24px', textAlign: 'center' }}>
                    Transfer Complete!
                  </h2>
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={closeModal}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '24px',
                        cursor: 'pointer',
                        color: '#666',
                        padding: '4px',
                        borderRadius: '4px'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      ×
                    </button>
                  </div>
                </div>

                {/* Updated confirmation message - much closer to heading */}
                <div style={{
                  color: '#1652F0',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  marginBottom: '16px',
                  textAlign: 'center'
                }}>
                  We've confirmed the transfer into our wallet. You're now ready to start trading
                </div>

                {/* Total funds available - matching previous screen formatting */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', flex: 1 }}>
                      Total funds available in wallet
                    </label>
                    <div style={{
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '16px',
                      backgroundColor: '#f8f9fa',
                      fontWeight: 'bold',
                      minWidth: '150px',
                      textAlign: 'center'
                    }}>
                      {parseFloat(formData.amount).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 8 })} {getTransferCurrency()}
                    </div>
                  </div>
                </div>

                {/* Trade direction - non-editable display */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Trade direction
                  </label>
                  <div style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                    backgroundColor: '#f8f9fa',
                    color: '#666'
                  }}>
                    {formData.direction}
                  </div>
                </div>

                {/* Asset trading pair - non-editable display */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Asset trading pair
                  </label>
                  <div style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                    backgroundColor: '#f8f9fa',
                    color: '#666'
                  }}>
                    {formData.tradingPair}
                  </div>
                </div>

                {/* Payment period - dropdown with same formatting */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Confirm your payment period
                  </label>
                  <select
                    value={formData.paymentPeriod}
                    onChange={(e) => handleInputChange('paymentPeriod', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '16px',
                      boxSizing: 'border-box',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="1 day">1 day</option>
                    <option value="2 days">2 days</option>
                    <option value="7 days">7 days</option>
                    <option value="14 days">14 days</option>
                    <option value="28 days">28 days</option>
                  </select>
                </div>

                {/* Trade amount - with limit validation and no arrows */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    How many of your funds would you like to trade with?
                  </label>
                  <input
                    type="text"
                    value={tradeAmount}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow only numbers and one decimal point with up to 8 decimal places
                      if (/^\d*\.?\d{0,8}$/.test(value) || value === '') {
                        const numValue = parseFloat(value) || 0;
                        const maxAmount = parseFloat(formData.amount) || 0;
                        // Only update if the value is within the allowed range
                        if (value === '' || (numValue >= 0 && numValue <= maxAmount)) {
                          setTradeAmount(value);
                        }
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Trading Summary - calculations linked to total funds currency */}
                <div style={{
                  backgroundColor: '#f8f9fa',
                  padding: '12px',
                  borderRadius: '8px',
                  marginBottom: '12px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span>Your total payment would be</span>
                    <span style={{ fontWeight: 'bold' }}>{calculateStep2Values().totalPaymentFormatted} {getTransferCurrency()}</span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span>Your 15% deposit amount would be</span>
                    <span style={{ fontWeight: 'bold' }}>{calculateStep2Values().depositAmountFormatted} {getTransferCurrency()}</span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>MiDA transaction fee is</span>
                    <span style={{ fontWeight: 'bold' }}>{calculateStep2Values().transactionFeeFormatted} {getTransferCurrency()}</span>
                  </div>
                </div>

                {/* Live trading price - moved below calculations */}
                <div style={{
                  textAlign: 'center',
                  marginBottom: '12px',
                  padding: '12px',
                  backgroundColor: '#f0f4ff',
                  borderRadius: '8px',
                  border: '2px solid #1652F0'
                }}>
                  <div style={{ fontSize: '16px', color: '#666', marginBottom: '6px', fontWeight: 'bold' }}>
                    {formData.tradingPair} Live Trading Price
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1652F0' }}>
                    ${livePrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </div>
                </div>

                {/* Purchase button - pink color, no cancel button */}
                <button
                  onClick={goToConfirmation}
                  style={{
                    width: '100%',
                    backgroundColor: '#FF4AE2',
                    color: 'white',
                    border: 'none',
                    padding: '16px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#E63BCC'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#FF4AE2'}
                >
                  Purchase my asset
                </button>
              </div>
            )}

            {/* Step 3: Trade Confirmation */}
            {currentStep === 3 && (
              <div style={{ padding: '24px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px',
                  borderBottom: '1px solid #eee',
                  paddingBottom: '12px'
                }}>
                  <div style={{ flex: 1 }}></div>
                  <h2 style={{ margin: 0, color: '#1652F0', fontSize: '24px', textAlign: 'center' }}>
                    Trade Confirmed!
                  </h2>
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={closeModal}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '24px',
                        cursor: 'pointer',
                        color: '#666',
                        padding: '4px',
                        borderRadius: '4px'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      ×
                    </button>
                  </div>
                </div>

                {/* Sub-header */}
                <div style={{
                  color: '#1652F0',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  marginBottom: '24px',
                  textAlign: 'center'
                }}>
                  Below is a summary of your trade details, which can be found in your trade history:
                </div>

                {/* Trade Details Summary */}
                <div style={{
                  backgroundColor: '#f8f9fa',
                  padding: '20px',
                  borderRadius: '8px',
                  marginBottom: '24px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontWeight: 'bold' }}>Asset trading pair:</span>
                    <span>{formData.tradingPair}</span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontWeight: 'bold' }}>Asset settlement price:</span>
                    <span>${calculateConfirmationValues().settlementPrice}</span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontWeight: 'bold' }}>Trade direction:</span>
                    <span>{formData.direction}</span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <span style={{ fontWeight: 'bold' }}>Payment period:</span>
                    <span>{formData.paymentPeriod}</span>
                  </div>

                  <div style={{ borderTop: '1px solid #ddd', paddingTop: '16px' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '12px', color: '#1652F0' }}>
                      Payment details:
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', paddingLeft: '16px' }}>
                      <span>15% deposit amount:</span>
                      <span>{calculateConfirmationValues().depositAmountFormatted} {calculateConfirmationValues().paymentCurrency}</span>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', paddingLeft: '16px' }}>
                      <span>MiDA transaction fee:</span>
                      <span>{calculateConfirmationValues().transactionFeeFormatted} {calculateConfirmationValues().paymentCurrency}</span>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', paddingLeft: '16px' }}>
                      <span>Overall payment amount:</span>
                      <span>{calculateConfirmationValues().totalPaymentFormatted} {calculateConfirmationValues().paymentCurrency}</span>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', paddingLeft: '16px' }}>
                      <span>Remaining payment due:</span>
                      <span>{calculateConfirmationValues().remainingPaymentFormatted} {calculateConfirmationValues().paymentCurrency}</span>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '16px' }}>
                      <span>Total asset to be received:</span>
                      <span>{calculateConfirmationValues().totalAssetReceivedFormatted} {calculateConfirmationValues().receivedCurrency}</span>
                    </div>
                  </div>
                </div>

                {/* Close button */}
                <button
                  onClick={closeModal}
                  style={{
                    width: '100%',
                    backgroundColor: '#1652F0',
                    color: 'white',
                    border: 'none',
                    padding: '16px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#0f3cc9'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#1652F0'}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

// Main App Component
function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(2856.42);
  const menuRef = useRef();

  // Close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Generate 150 sample orders for buy and sell
  const generateOrders = (type) =>
    Array.from({ length: 150 }, (_, i) => {
      const priceNum = 112000 + (type === "buy" ? i * 10 : i * 12);
      const price = `${priceNum.toLocaleString()}`;
      const volume = (Math.random() * 0.5 + 0.05).toFixed(2) + " BTC";
      const amountNum = priceNum * parseFloat(volume);
      const amount = amountNum.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return { price, volume, amount: `${amount}` };
    });

  const buyOrders = generateOrders("buy");
  const sellOrders = generateOrders("sell");

  // Generate 150 sample recent trades with formatted amount including commas and 2 decimals
  const generateTrades = () =>
    Array.from({ length: 150 }, (_, i) => {
      const hours = 12;
      const minutes = Math.floor(Math.random() * 60);
      const seconds = Math.floor(Math.random() * 60);
      const time = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      const priceNum = 112000 + i * 7;
      const price = `${priceNum.toLocaleString()}`;
      const volume = (Math.random() * 0.5 + 0.01).toFixed(3) + " BTC";
      const amountNum = priceNum * parseFloat(volume);
      const amount = amountNum.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return { time, price, volume, amount: `${amount}` };
    });

  const recentTrades = generateTrades();

  // Styles for tables and cells with tighter spacing
  const tableContainerStyle = {
    maxHeight: "320px", // show ~10 rows with scroll
    overflowY: "auto",
    border: "1px solid #ddd",
    borderRadius: "4px",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "12px",
  };

  const thTdStyle = {
    border: "1px solid #ddd",
    padding: "4px 6px", // tighter padding
    textAlign: "left",
    fontSize: "12px",
  };

  return (
    <div
      style={{
        backgroundColor: "#fff",
        color: "#000",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          backgroundColor: "#fff",
          color: "#1652F0",
          padding: "24px",
          fontWeight: "bold",
          fontSize: "32px",
          textAlign: "center",
          borderBottom: "1px solid #eee",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        MiDA Exchange

        {/* Right-side controls container */}
        <div
          style={{
            position: "absolute",
            right: "24px",
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: "14px",
            fontWeight: "normal",
            color: "#1652F0",
            cursor: "default",
            userSelect: "none",
          }}
        >
          {/* Login | Create Account */}
          <div 
            tabIndex={0} 
            style={{ 
              cursor: "pointer",
              padding: "8px 12px",
              borderRadius: "4px",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = "#f0f4ff"}
            onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
          >
            Login | Create Account
          </div>

          {/* Hamburger menu */}
          <div
            ref={menuRef}
            style={{
              cursor: "pointer",
              width: "50px",
              height: "40px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              padding: "8px 6px",
              borderRadius: "4px",
              transition: "background-color 0.2s",
              backgroundColor: "transparent",
            }}
            onClick={() => setMenuOpen((open) => !open)}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f0f4ff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setMenuOpen((open) => !open);
              }
            }}
          >
            {[...Array(3)].map((_, i) => (
              <span
                key={i}
                style={{
                  display: "block",
                  height: "4px",
                  backgroundColor: "#1652F0",
                  borderRadius: "2px",
                  width: "100%",
                  pointerEvents: "none",
                }}
              />
            ))}
          </div>

          {/* Dropdown menu */}
          {menuOpen && (
            <div
              style={{
                position: "absolute",
                top: "60px",
                right: "0",
                backgroundColor: "#fff",
                border: "1px solid #ddd",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                borderRadius: "8px",
                width: "200px",
                zIndex: 1000,
                userSelect: "none",
              }}
            >
              <ul
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: "8px 0",
                  fontSize: "14px",
                  color: "#333",
                }}
              >
                {['Dashboard', 'Portfolio', 'Wallet', 'Trade History', 'Settings'].map((item, index) => (
                  <li 
                    key={item}
                    style={{ 
                      padding: "12px 20px", 
                      borderBottom: index < 4 ? "1px solid #eee" : "none",
                      cursor: "pointer",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = "#f8f9fa"}
                    onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                  >
                    {item}
                  </li>
                ))}
                <li 
                  style={{ 
                    padding: "12px 20px",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                    color: "#d73027",
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = "#fef2f2"}
                  onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>

      {/* Main Section */}
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "8px" }}>
          BTC/USDC
        </div>

        {/* Chart container stretched wider */}
        <div
          style={{
            backgroundColor: "#000",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 0 10px rgba(0,0,0,0.2)",
            width: "100%",
            maxWidth: "1200px",
          }}
        >
          <CandleChart onPriceUpdate={setCurrentPrice} />
        </div>

        {/* Buttons */}
        <div style={{ marginTop: "40px", display: "flex", gap: "20px" }}>
          <button
            style={{
              backgroundColor: "#1652F0",
              color: "#fff",
              border: "none",
              padding: "16px 36px",
              fontSize: "18px",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "background-color 0.2s ease"
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = "#0f3cc9"}
            onMouseLeave={(e) => e.target.style.backgroundColor = "#1652F0"}
          >
            Buy Now
          </button>
          
          {/* Pay Later button with workflow */}
          <PayLaterWorkflow currentPrice={currentPrice} />
        </div>

        {/* Combined tables container */}
        <div
          style={{
            marginTop: "40px",
            width: "100%",
            maxWidth: "1200px",
            display: "flex",
            gap: "20px",
            justifyContent: "space-between",
          }}
        >
          {/* Buy Orders Table */}
          <div style={{ flex: 1 }}>
            <h3 style={{ marginBottom: "6px" }}>Buy Orders</h3>
            <div style={tableContainerStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thTdStyle}>Price</th>
                    <th style={thTdStyle}>Volume</th>
                    <th style={thTdStyle}>Amount (USD)</th>
                  </tr>
                </thead>
                <tbody>
                  {buyOrders.slice(0, 50).map((order, index) => (
                    <tr key={index}>
                      <td style={thTdStyle}>{order.price}</td>
                      <td style={thTdStyle}>{order.volume}</td>
                      <td style={thTdStyle}>{order.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sell Orders Table */}
          <div style={{ flex: 1 }}>
            <h3 style={{ marginBottom: "6px" }}>Sell Orders</h3>
            <div style={tableContainerStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thTdStyle}>Price</th>
                    <th style={thTdStyle}>Volume</th>
                    <th style={thTdStyle}>Amount (USD)</th>
                  </tr>
                </thead>
                <tbody>
                  {sellOrders.slice(0, 50).map((order, index) => (
                    <tr key={index}>
                      <td style={thTdStyle}>{order.price}</td>
                      <td style={thTdStyle}>{order.volume}</td>
                      <td style={thTdStyle}>{order.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Trades Table */}
          <div style={{ flex: 1 }}>
            <h3 style={{ marginBottom: "6px" }}>Recent Trades</h3>
            <div style={tableContainerStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thTdStyle}>Time</th>
                    <th style={thTdStyle}>Price</th>
                    <th style={thTdStyle}>Volume</th>
                    <th style={thTdStyle}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTrades.slice(0, 50).map((trade, index) => (
                    <tr key={index}>
                      <td style={thTdStyle}>{trade.time}</td>
                      <td style={thTdStyle}>{trade.price}</td>
                      <td style={thTdStyle}>{trade.volume}</td>
                      <td style={thTdStyle}>{trade.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
