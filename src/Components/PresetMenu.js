import React, { useState, useEffect } from 'react';

function PresetMenu({ userId, isUserLoggedIn, onPresetSelected }) {
    const [presets, setPresets] = useState([]);
    const [selectedPreset, setSelectedPreset] = useState('');
  
    useEffect(() => {
      const fetchPresets = async () => {
        if (isUserLoggedIn) {
          console.log(`Fetching presets for userId: ${userId}`); // Log user ID
          try {
            const response = await fetch(`http://localhost:3001/api/users/getPresets?userId=${userId}`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            });
            if (!response.ok) throw new Error('Failed to fetch presets');
            const data = await response.json();
            console.log('Presets fetched:', data); // Log fetched presets
            setPresets(data);
          } catch (error) {  
            console.error('Error fetching presets:', error);
          }  
        }
      };
  
      fetchPresets();
    }, [userId, isUserLoggedIn]);
  
    const handlePresetSelection = (event) => {
      const selectedPresetId = event.target.value;
      setSelectedPreset(selectedPresetId);
  
      const selectedPresetDetails = presets.find(p => p._id === selectedPresetId);
      console.log(`Preset selected: ${selectedPresetId}`, selectedPresetDetails); // Log selected preset ID and details
  
      if (selectedPresetDetails && onPresetSelected) {
        onPresetSelected(selectedPresetDetails.settings);
        console.log('Preset settings passed to synthesizer:', selectedPresetDetails.settings); // Log settings being passed
      }
    };
  
    return (
      <div>  
        <label htmlFor="preset-select">Choose a preset:</label>
        <select id="preset-select" onChange={handlePresetSelection} value={selectedPreset}>
          {presets.map((preset, index) => (
            <option key={index} value={preset._id}>
              {preset.name}
            </option>
          ))}
        </select>
      </div>
    );
  }
  

export default PresetMenu;


