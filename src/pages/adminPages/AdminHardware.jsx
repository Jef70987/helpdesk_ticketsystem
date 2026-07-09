import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminHardware = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hardware, setHardware] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState([]);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    assigned: 0,
    maintenance: 0,
    repair: 0,
    retired: 0,
    lost: 0,
  });
  const [categoryStats, setCategoryStats] = useState([]);
  const [conditionStats, setConditionStats] = useState([]);

  const statuses = ['available', 'assigned', 'maintenance', 'repair', 'retired', 'lost'];

  useEffect(() => {
    fetchHardware();
    fetchCategories();
    fetchMovements();
  }, []);

  useEffect(() => {
    fetchHardware();
  }, [statusFilter, categoryFilter]);

  const fetchHardware = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (categoryFilter) params.append('category', categoryFilter);
      
      const response = await api.get(`/admin/hardware/?${params.toString()}`);
      const items = response.results || response || [];
      setHardware(items);
      
      const statsData = {
        total: items.length,
        available: items.filter(i => i.status === 'available').length,
        assigned: items.filter(i => i.status === 'assigned').length,
        maintenance: items.filter(i => i.status === 'maintenance').length,
        repair: items.filter(i => i.status === 'repair').length,
        retired: items.filter(i => i.status === 'retired').length,
        lost: items.filter(i => i.status === 'lost').length,
      };
      setStats(statsData);

      const categoryMap = {};
      items.forEach(item => {
        const catName = item.category_name || 'Uncategorized';
        if (!categoryMap[catName]) {
          categoryMap[catName] = 0;
        }
        categoryMap[catName]++;
      });
      setCategoryStats(Object.entries(categoryMap).map(([name, count]) => ({ name, count })));

      const conditionMap = {};
      items.forEach(item => {
        const cond = item.condition || 'unknown';
        if (!conditionMap[cond]) {
          conditionMap[cond] = 0;
        }
        conditionMap[cond]++;
      });
      setConditionStats(Object.entries(conditionMap).map(([name, count]) => ({ name, count })));

    } catch (error) {
      console.error('Failed to fetch hardware:', error);
      setError('Failed to load hardware items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/admin/hardware/categories/');
      setCategories(response || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchMovements = async () => {
    try {
      const response = await api.get('/admin/hardware/movements/');
      setMovements(response || []);
    } catch (error) {
      console.error('Failed to fetch movements:', error);
    }
  };

  const handleViewHardware = (itemId) => {
    navigate(`/admin/hardware/${itemId}`);
  };

  const handleAddHardware = () => {
    navigate('/admin/hardware/create');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchHardware();
  };

  // Professional PDF Report Generation - Clean Black & White
  const generatePDFReport = () => {
    setGeneratingReport(true);
    try {
      const doc = new jsPDF('l', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      // === HEADER - Only colored element ===
      doc.setFillColor(50, 50, 50);
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('HARDWARE INVENTORY REPORT', pageWidth / 2, 25, { align: 'center' });
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 34, { align: 'center' });
      
      let yPos = 50;
      
      // === SUMMARY STATISTICS - No fill ===
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('SUMMARY STATISTICS', 14, yPos);
      yPos += 6;
      
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.3);
      doc.line(14, yPos, pageWidth - 14, yPos);
      yPos += 5;
      
      const summaryItems = [
        ['Total Items', stats.total],
        ['Available', stats.available],
        ['Assigned', stats.assigned],
        ['Maintenance', stats.maintenance],
        ['Repair', stats.repair],
        ['Retired', stats.retired],
        ['Lost', stats.lost],
      ];
      
      const colsPerRow = 4;
      summaryItems.forEach(([label, value], index) => {
        const col = index % colsPerRow;
        const row = Math.floor(index / colsPerRow);
        const xPos = 14 + (col * (pageWidth / colsPerRow - 10));
        const yPos2 = yPos + (row * 8);
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(50, 50, 50);
        doc.text(`${label}:`, xPos, yPos2);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text(String(value), xPos + 30, yPos2);
      });
      
      yPos += (Math.ceil(summaryItems.length / colsPerRow) * 8) + 10;
      
      // === STATUS BREAKDOWN - No fill ===
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('STATUS BREAKDOWN', 14, yPos);
      yPos += 6;
      
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.3);
      doc.line(14, yPos, pageWidth - 14, yPos);
      yPos += 5;
      
      const statusData = [
        ['Status', 'Count', 'Percentage (%)']
      ];
      
      const statusEntries = [
        ['Available', stats.available],
        ['Assigned', stats.assigned],
        ['Maintenance', stats.maintenance],
        ['Repair', stats.repair],
        ['Retired', stats.retired],
        ['Lost', stats.lost],
      ];
      
      statusEntries.forEach(([status, count]) => {
        const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
        statusData.push([status, count, percentage]);
      });
      
      let currentY = yPos;
      const colWidths = [50, 30, 30];
      
      statusData.forEach((row, rowIndex) => {
        // Header row - bold text
        if (rowIndex === 0) {
          doc.setTextColor(0, 0, 0);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
        } else {
          doc.setTextColor(0, 0, 0);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
        }
        
        let xOffset = 14;
        row.forEach((cell, cellIndex) => {
          const cellWidth = colWidths[cellIndex] || 40;
          // Only draw border - NO FILL
          doc.rect(xOffset, currentY, cellWidth, 8, 'S');
          doc.text(String(cell), xOffset + 2, currentY + 5.5);
          xOffset += cellWidth;
        });
        currentY += 8;
      });
      
      yPos = currentY + 10;
      
      // === CONDITION BREAKDOWN - No fill ===
      if (conditionStats.length > 0) {
        if (yPos > pageHeight - 60) {
          doc.addPage();
          yPos = 20;
        }
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('CONDITION BREAKDOWN', 14, yPos);
        yPos += 6;
        
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.3);
        doc.line(14, yPos, pageWidth - 14, yPos);
        yPos += 5;
        
        const conditionData = [
          ['Condition', 'Count', 'Percentage (%)']
        ];
        
        conditionStats.forEach(({ name, count }) => {
          const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
          conditionData.push([formatCondition(name), count, percentage]);
        });
        
        let currentY2 = yPos;
        const colWidths2 = [50, 30, 30];
        
        conditionData.forEach((row, rowIndex) => {
          if (rowIndex === 0) {
            doc.setTextColor(0, 0, 0);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
          } else {
            doc.setTextColor(0, 0, 0);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
          }
          
          let xOffset = 14;
          row.forEach((cell, cellIndex) => {
            const cellWidth = colWidths2[cellIndex] || 40;
            // Only draw border - NO FILL
            doc.rect(xOffset, currentY2, cellWidth, 8, 'S');
            doc.text(String(cell), xOffset + 2, currentY2 + 5.5);
            xOffset += cellWidth;
          });
          currentY2 += 8;
        });
        
        yPos = currentY2 + 10;
      }
      
      // === CATEGORY BREAKDOWN - No fill ===
      if (categoryStats.length > 0) {
        if (yPos > pageHeight - 60) {
          doc.addPage();
          yPos = 20;
        }
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('CATEGORY BREAKDOWN', 14, yPos);
        yPos += 6;
        
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.3);
        doc.line(14, yPos, pageWidth - 14, yPos);
        yPos += 5;
        
        const categoryData = [
          ['Category', 'Count', 'Percentage (%)']
        ];
        
        categoryStats.forEach(({ name, count }) => {
          const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
          categoryData.push([name, count, percentage]);
        });
        
        let currentY3 = yPos;
        const colWidths3 = [60, 30, 30];
        
        categoryData.forEach((row, rowIndex) => {
          if (rowIndex === 0) {
            doc.setTextColor(0, 0, 0);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
          } else {
            doc.setTextColor(0, 0, 0);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
          }
          
          let xOffset = 14;
          row.forEach((cell, cellIndex) => {
            const cellWidth = colWidths3[cellIndex] || 40;
            // Only draw border - NO FILL
            doc.rect(xOffset, currentY3, cellWidth, 8, 'S');
            doc.text(String(cell), xOffset + 2, currentY3 + 5.5);
            xOffset += cellWidth;
          });
          currentY3 += 8;
        });
        
        yPos = currentY3 + 10;
      }
      
      // === COMPLETE INVENTORY LIST - No fill ===
      doc.addPage();
      yPos = 20;
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('COMPLETE INVENTORY LIST', 14, yPos);
      yPos += 6;
      
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.3);
      doc.line(14, yPos, pageWidth - 14, yPos);
      yPos += 5;
      
      const headers = ['Name', 'Serial #', 'Brand', 'Model', 'Status', 'Condition', 'Category', 'Assigned To'];
      const colWidths4 = [40, 30, 25, 25, 25, 25, 30, 30];
      let currentY4 = yPos;
      
      // Draw header - bold text, no fill
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      
      let xOffset4 = 14;
      headers.forEach((header, index) => {
        const cellWidth = colWidths4[index] || 30;
        // Only border - NO FILL
        doc.rect(xOffset4, currentY4, cellWidth, 7, 'S');
        doc.text(header, xOffset4 + 2, currentY4 + 5);
        xOffset4 += cellWidth;
      });
      currentY4 += 7;
      
      // Draw data rows - ONLY BORDERS, NO FILL
      hardware.forEach((item, rowIndex) => {
        if (currentY4 > pageHeight - 20) {
          doc.addPage();
          currentY4 = 20;
          
          // Redraw header on new page
          doc.setTextColor(0, 0, 0);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          
          let xOffsetNew = 14;
          headers.forEach((header, index) => {
            const cellWidth = colWidths4[index] || 30;
            doc.rect(xOffsetNew, currentY4, cellWidth, 7, 'S');
            doc.text(header, xOffsetNew + 2, currentY4 + 5);
            xOffsetNew += cellWidth;
          });
          currentY4 += 7;
        }
        
        // Data row - normal text, only borders
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        
        const rowData = [
          item.name || 'N/A',
          item.serial_number || 'N/A',
          item.brand || 'N/A',
          item.model || 'N/A',
          formatStatus(item.status),
          formatCondition(item.condition),
          item.category_name || 'Uncategorized',
          item.assigned_to_name || 'Unassigned',
        ];
        
        let xOffsetRow = 14;
        rowData.forEach((cell, cellIndex) => {
          const cellWidth = colWidths4[cellIndex] || 30;
          // Only draw border - NO FILL
          doc.rect(xOffsetRow, currentY4, cellWidth, 6, 'S');
          doc.text(String(cell).substring(0, 25), xOffsetRow + 1, currentY4 + 4.5);
          xOffsetRow += cellWidth;
        });
        currentY4 += 6;
      });
      
      // === FOOTER ===
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(7);
        doc.setTextColor(100, 100, 100);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - 30, pageHeight - 8);
        doc.text('Generated by Hardware Inventory Management System', 14, pageHeight - 8);
      }
      
      doc.save(`Hardware_Inventory_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      setError('Failed to generate PDF report. Please try again.');
    } finally {
      setGeneratingReport(false);
    }
  };

  // Excel Report Generation
  const generateExcelReport = () => {
    setGeneratingReport(true);
    try {
      const wb = XLSX.utils.book_new();
      
      // === SHEET 1: SUMMARY ===
      const summaryData = [
        ['HARDWARE INVENTORY REPORT'],
        [`Generated: ${new Date().toLocaleString()}`],
        [],
        ['SUMMARY STATISTICS'],
        ['Metric', 'Value'],
        ['Total Items', stats.total],
        ['Available', stats.available],
        ['Assigned', stats.assigned],
        ['In Maintenance', stats.maintenance],
        ['In Repair', stats.repair],
        ['Retired', stats.retired],
        ['Lost', stats.lost],
      ];
      
      const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
      ws1['!cols'] = [{ wch: 25 }, { wch: 20 }];
      XLSX.utils.book_append_sheet(wb, ws1, 'Summary');
      
      // === SHEET 2: STATUS BREAKDOWN ===
      const statusData = [
        ['STATUS BREAKDOWN'],
        ['Status', 'Count', 'Percentage (%)']
      ];
      
      const statusEntries = [
        ['Available', stats.available],
        ['Assigned', stats.assigned],
        ['Maintenance', stats.maintenance],
        ['Repair', stats.repair],
        ['Retired', stats.retired],
        ['Lost', stats.lost],
      ];
      
      statusEntries.forEach(([status, count]) => {
        const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
        statusData.push([status, count, percentage]);
      });
      
      const ws2 = XLSX.utils.aoa_to_sheet(statusData);
      ws2['!cols'] = [{ wch: 20 }, { wch: 15 }, { wch: 15 }];
      XLSX.utils.book_append_sheet(wb, ws2, 'Status Breakdown');
      
      // === SHEET 3: CONDITION BREAKDOWN ===
      const conditionData = [
        ['CONDITION BREAKDOWN'],
        ['Condition', 'Count', 'Percentage (%)']
      ];
      
      conditionStats.forEach(({ name, count }) => {
        const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
        conditionData.push([formatCondition(name), count, percentage]);
      });
      
      const ws3 = XLSX.utils.aoa_to_sheet(conditionData);
      ws3['!cols'] = [{ wch: 25 }, { wch: 15 }, { wch: 15 }];
      XLSX.utils.book_append_sheet(wb, ws3, 'Condition Breakdown');
      
      // === SHEET 4: CATEGORY BREAKDOWN ===
      const categoryData = [
        ['CATEGORY BREAKDOWN'],
        ['Category', 'Count', 'Percentage (%)']
      ];
      
      categoryStats.forEach(({ name, count }) => {
        const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
        categoryData.push([name, count, percentage]);
      });
      
      const ws4 = XLSX.utils.aoa_to_sheet(categoryData);
      ws4['!cols'] = [{ wch: 30 }, { wch: 15 }, { wch: 15 }];
      XLSX.utils.book_append_sheet(wb, ws4, 'Category Breakdown');
      
      // === SHEET 5: COMPLETE INVENTORY ===
      const inventoryData = [
        ['COMPLETE HARDWARE INVENTORY'],
        ['Name', 'Serial Number', 'Brand', 'Model', 'Status', 'Condition', 'Category', 'Assigned To', 'Location']
      ];
      
      hardware.forEach(item => {
        inventoryData.push([
          item.name || 'N/A',
          item.serial_number || 'N/A',
          item.brand || 'N/A',
          item.model || 'N/A',
          formatStatus(item.status),
          formatCondition(item.condition),
          item.category_name || 'Uncategorized',
          item.assigned_to_name || 'Unassigned',
          item.location || 'N/A'
        ]);
      });
      
      const ws5 = XLSX.utils.aoa_to_sheet(inventoryData);
      ws5['!cols'] = [
        { wch: 30 }, { wch: 20 }, { wch: 18 }, { wch: 18 }, 
        { wch: 15 }, { wch: 15 }, { wch: 25 }, { wch: 25 }, { wch: 20 }
      ];
      XLSX.utils.book_append_sheet(wb, ws5, 'Complete Inventory');
      
      // === SHEET 6: RECENT MOVEMENTS ===
      if (movements.length > 0) {
        const movementData = [
          ['RECENT MOVEMENTS'],
          ['Item', 'Type', 'From', 'To', 'Date']
        ];
        
        movements.slice(0, 100).forEach(movement => {
          movementData.push([
            movement.hardware_name || 'N/A',
            formatMovementType(movement.movement_type),
            movement.from_user_name || 'System',
            movement.to_user_name || 'System',
            new Date(movement.movement_date).toLocaleDateString()
          ]);
        });
        
        const ws6 = XLSX.utils.aoa_to_sheet(movementData);
        ws6['!cols'] = [{ wch: 30 }, { wch: 18 }, { wch: 25 }, { wch: 25 }, { wch: 18 }];
        XLSX.utils.book_append_sheet(wb, ws6, 'Recent Movements');
      }
      
      // Generate and download Excel file
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Hardware_Inventory_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Failed to generate Excel:', error);
      setError('Failed to generate Excel report. Please try again.');
    } finally {
      setGeneratingReport(false);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      'available': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'assigned': 'bg-blue-100 text-blue-800 border-blue-200',
      'maintenance': 'bg-amber-100 text-amber-800 border-amber-200',
      'repair': 'bg-orange-100 text-orange-800 border-orange-200',
      'retired': 'bg-gray-100 text-gray-700 border-gray-200',
      'lost': 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const formatStatus = (status) => {
    const labels = {
      'available': 'Available',
      'assigned': 'Assigned',
      'maintenance': 'Maintenance',
      'repair': 'Repair',
      'retired': 'Retired',
      'lost': 'Lost',
    };
    return labels[status] || status || 'Unknown';
  };

  const getConditionBadge = (condition) => {
    const colors = {
      'new': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'good': 'bg-blue-100 text-blue-800 border-blue-200',
      'fair': 'bg-amber-100 text-amber-800 border-amber-200',
      'poor': 'bg-red-100 text-red-800 border-red-200',
      'repair_needed': 'bg-orange-100 text-orange-800 border-orange-200',
    };
    return colors[condition] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const formatCondition = (condition) => {
    const labels = {
      'new': 'New',
      'good': 'Good',
      'fair': 'Fair',
      'poor': 'Poor',
      'repair_needed': 'Repair Needed',
    };
    return labels[condition] || condition || 'Unknown';
  };

  const formatMovementType = (type) => {
    const labels = {
      'assigned': 'Assigned',
      'returned': 'Returned',
      'maintenance': 'Maintenance',
      'retired': 'Retired',
      'transferred': 'Transferred',
    };
    return labels[type] || type || 'Unknown';
  };

  const getMovementTypeBadge = (type) => {
    const colors = {
      'assigned': 'bg-blue-100 text-blue-800 border-blue-200',
      'returned': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'maintenance': 'bg-amber-100 text-amber-800 border-amber-200',
      'retired': 'bg-gray-100 text-gray-700 border-gray-200',
      'transferred': 'bg-purple-100 text-purple-800 border-purple-200',
    };
    return colors[type] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const statusChartData = {
    labels: ['Available', 'Assigned', 'Maintenance', 'Repair', 'Retired', 'Lost'],
    datasets: [
      {
        label: 'Hardware by Status',
        data: [
          stats.available,
          stats.assigned,
          stats.maintenance,
          stats.repair,
          stats.retired,
          stats.lost,
        ],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(107, 114, 128, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(251, 146, 60, 1)',
          'rgba(107, 114, 128, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const statusChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { size: 11 },
          color: '#64748b',
          padding: 12,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: '#ffffff',
        titleColor: '#1e293b',
        bodyColor: '#1e293b',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        cornerRadius: 6,
        padding: 12,
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? Math.round((context.parsed / total) * 100) : 0;
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '70%',
  };

  const categoryChartData = {
    labels: categoryStats.map(item => item.name),
    datasets: [
      {
        label: 'Items by Category',
        data: categoryStats.map(item => item.count),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(99, 102, 241, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(217, 70, 239, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(244, 63, 94, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(251, 146, 60, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(99, 102, 241, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(217, 70, 239, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(244, 63, 94, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(251, 146, 60, 1)',
        ],
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const categoryChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#ffffff',
        titleColor: '#1e293b',
        bodyColor: '#1e293b',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        cornerRadius: 6,
        padding: 12,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: {
            size: 11,
          },
          color: '#64748b',
        },
        grid: {
          color: 'rgba(100, 116, 139, 0.1)',
        },
      },
      x: {
        ticks: {
          font: {
            size: 10,
          },
          color: '#64748b',
          maxRotation: 45,
          minRotation: 0,
        },
        grid: {
          display: false,
        },
      },
    },
  };

  const conditionColors = {
    'new': 'rgba(16, 185, 129, 0.85)',
    'good': 'rgba(59, 130, 246, 0.85)',
    'fair': 'rgba(245, 158, 11, 0.85)',
    'poor': 'rgba(239, 68, 68, 0.85)',
    'repair_needed': 'rgba(251, 146, 60, 0.85)',
  };

  const conditionBorderColors = {
    'new': 'rgba(16, 185, 129, 1)',
    'good': 'rgba(59, 130, 246, 1)',
    'fair': 'rgba(245, 158, 11, 1)',
    'poor': 'rgba(239, 68, 68, 1)',
    'repair_needed': 'rgba(251, 146, 60, 1)',
  };

  const conditionChartData = {
    labels: conditionStats.map(item => formatCondition(item.name)),
    datasets: [
      {
        data: conditionStats.map(item => item.count),
        backgroundColor: conditionStats.map(item => conditionColors[item.name] || 'rgba(107, 114, 128, 0.85)'),
        borderColor: conditionStats.map(item => conditionBorderColors[item.name] || 'rgba(107, 114, 128, 1)'),
        borderWidth: 2,
      },
    ],
  };

  const conditionChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { size: 11 },
          color: '#64748b',
          padding: 12,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: '#ffffff',
        titleColor: '#1e293b',
        bodyColor: '#1e293b',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        cornerRadius: 6,
        padding: 12,
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? Math.round((context.parsed / total) * 100) : 0;
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '70%',
  };

  const sortedHardware = [...hardware].sort((a, b) => {
    const catA = a.category_name || 'Uncategorized';
    const catB = b.category_name || 'Uncategorized';
    return catA.localeCompare(catB);
  });

  const filteredHardware = sortedHardware.filter(item => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      item.name?.toLowerCase().includes(search) ||
      item.serial_number?.toLowerCase().includes(search) ||
      item.brand?.toLowerCase().includes(search) ||
      item.model?.toLowerCase().includes(search)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-white border border-gray-200 rounded">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hardware Inventory</h1>
          <p className="text-sm text-gray-500 mt-1">{filteredHardware.length} item{filteredHardware.length !== 1 ? 's' : ''} found</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button 
            onClick={generatePDFReport}
            disabled={generatingReport}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            {generatingReport ? 'Generating...' : 'PDF Report'}
          </button>
          <button 
            onClick={generateExcelReport}
            disabled={generatingReport}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2-2V9a2 2 0 012-2m0 10a2 2 0 002-2V9a2 2 0 00-2-2M9 17v6m2-4v4m-4-4v4" />
            </svg>
            {generatingReport ? 'Generating...' : 'Excel Report'}
          </button>
          <button 
            onClick={handleAddHardware}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Hardware
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 border border-gray-200 shadow-sm">
          <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
          <p className="text-xs text-gray-600 font-medium">Total Items</p>
        </div>
        <div className="bg-white p-4 border border-gray-200 shadow-sm">
          <p className="text-2xl font-bold text-emerald-600">{stats.available}</p>
          <p className="text-xs text-gray-600 font-medium">Available</p>
        </div>
        <div className="bg-white p-4 border border-gray-200 shadow-sm">
          <p className="text-2xl font-bold text-amber-600">{stats.maintenance + stats.repair}</p>
          <p className="text-xs text-gray-600 font-medium">In Service</p>
        </div>
        <div className="bg-white p-4 border border-gray-200 shadow-sm">
          <p className="text-2xl font-bold text-red-600">{stats.lost}</p>
          <p className="text-xs text-gray-600 font-medium">Lost</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1 bg-white border border-gray-200 rounded p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Status Distribution</h3>
          <div className="h-52">
            <Doughnut data={statusChartData} options={statusChartOptions} />
          </div>
        </div>

        <div className="lg:col-span-1 bg-white border border-gray-200 rounded p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Condition Distribution</h3>
          <div className="h-52">
            {conditionStats.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">No condition data available</p>
            ) : (
              <Doughnut data={conditionChartData} options={conditionChartOptions} />
            )}
          </div>
        </div>

        <div className="lg:col-span-1 bg-white border border-gray-200 rounded p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Items by Category</h3>
          <div className="h-52">
            {categoryStats.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">No category data available</p>
            ) : (
              <Bar data={categoryChartData} options={categoryChartOptions} />
            )}
          </div>
        </div>
      </div>

      {/* Recent Movements */}
      <div className="bg-white border border-gray-200 rounded p-5 shadow-sm mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Recent Movements</h3>
        {movements.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">No movements recorded</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Item</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">From</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">To</th>
                  <th className="hidden md:table-cell px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {movements.slice(0, 10).map((movement) => (
                  <tr key={movement.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-2 font-medium text-gray-900">{movement.hardware_name}</td>
                    <td className="px-3 py-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium border rounded-full ${getMovementTypeBadge(movement.movement_type)}`}>
                        {formatMovementType(movement.movement_type)}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-gray-600">{movement.from_user_name || 'System'}</td>
                    <td className="px-3 py-2 text-gray-600">{movement.to_user_name || 'System'}</td>
                    <td className="hidden md:table-cell px-3 py-2 text-gray-500">
                      {new Date(movement.movement_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="flex flex-wrap gap-3 mb-4">
        <form onSubmit={handleSearch} className="flex flex-1 min-w-[200px]">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, serial, brand..."
            className="flex-1 px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-l text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-r border border-l-0 border-gray-300 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-1.5 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setStatusFilter('')}
          className={`flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded transition-all duration-200 whitespace-nowrap ${
            !statusFilter ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Status
        </button>
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded transition-all duration-200 whitespace-nowrap ${
              statusFilter === status ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {formatStatus(status)}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm font-medium rounded">
          {error}
        </div>
      )}

      {filteredHardware.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded p-10 text-center shadow-sm">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gray-50 rounded-full">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p className="text-gray-500">No hardware items found</p>
          {statusFilter && (
            <button 
              onClick={() => setStatusFilter('')}
              className="mt-3 text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              Clear filter
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Item</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Serial</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Condition</th>
                  <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Assigned To</th>
                  <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredHardware.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                        <p className="text-gray-500 text-xs">{item.brand} {item.model}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-sm font-mono">{item.serial_number || 'N/A'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium border rounded-full ${getStatusBadge(item.status)}`}>
                        {formatStatus(item.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium border rounded-full ${getConditionBadge(item.condition)}`}>
                        {formatCondition(item.condition)}
                      </span>
                    </td>
                    <td className="hidden md:table-cell px-4 py-3 text-gray-600 text-sm truncate max-w-[100px]">{item.assigned_to_name || 'Unassigned'}</td>
                    <td className="hidden lg:table-cell px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                        {item.category_name || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={() => handleViewHardware(item.id)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHardware;