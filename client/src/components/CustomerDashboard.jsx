import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import './customer.css';
import { Excalidraw } from "@excalidraw/excalidraw";

import "@excalidraw/excalidraw/index.css";

const CustomerComponent = () => {
  

  return (
    <div className="customer-dashboard">
      
          {/* Main Content */}
              <main className="app-container">
              <h1 style={{color:'white'}}>Excalidraw Canvas</h1>
              <div className="excalidraw-wrapper">
                <Excalidraw />
              </div>
            </main>
    </div>
  );
};

export default CustomerComponent;
