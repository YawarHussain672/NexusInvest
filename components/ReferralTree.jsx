'use client';
import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { ChevronRight, ChevronDown, UserSquare2, Network } from 'lucide-react';

const ReferralTree = () => {
  const [treeData, setTreeData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTree = async () => {
      try {
        const { data } = await api.get('/dashboard/referrals/tree');
        setTreeData(data);
      } catch (error) {
        console.error('Failed to fetch referral tree', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTree();
  }, []);

  if (loading) return <div className="animate-pulse h-64 bg-[#1C1C1E] border border-[#38383A]/60 rounded-3xl"></div>;

  return (
    <div className="bg-[#1C1C1E] border border-[#38383A]/60 rounded-3xl p-6 shadow-xl relative overflow-hidden">
      <div className="flex items-center mb-6 border-b border-[#38383A]/60 pb-4">
        <div className="p-3 bg-blue-500/10 rounded-2xl mr-4">
          <Network className="w-6 h-6 text-[#0A84FF]" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">Referral Network</h3>
          <p className="text-[13px] text-gray-400 font-medium">Your multi-level downline team</p>
        </div>
      </div>

      {treeData.length === 0 ? (
        <div className="text-center py-12 bg-black/40 rounded-2xl border border-dashed border-[#38383A] relative z-10">
          <UserSquare2 className="w-10 h-10 mx-auto text-gray-500 mb-3" />
          <p className="text-gray-300 font-medium">You haven't referred anyone yet.</p>
          <p className="text-[13px] text-gray-500 mt-1">Share your referral code to start earning level income!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {treeData.map((node) => (
            <TreeNode key={node.id} node={node} />
          ))}
        </div>
      )}
    </div>
  );
};

const TreeNode = ({ node }) => {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="text-sm text-gray-300 relative">
      <div 
        className={`flex items-center p-3 rounded-2xl border transition-colors ${
          hasChildren ? 'cursor-pointer hover:bg-white/5 border-[#38383A]/60' : 'bg-black/30 border-transparent'
        } ${expanded ? 'bg-[#38383A]/40 border-[#38383A]' : ''}`}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        <div className="mr-3 w-6 flex justify-center">
          {hasChildren ? (
            expanded ? <ChevronDown className="w-5 h-5 text-[#0A84FF]" /> : <ChevronRight className="w-5 h-5 text-gray-500" />
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
          )}
        </div>
        
        <div className="flex-1 flex flex-col sm:flex-row justify-between sm:items-center gap-2 sm:gap-0">
          <div className="flex items-center space-x-3">
            <span className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full bg-[#0A84FF]/10 text-[#0A84FF] border border-[#0A84FF]/20 flex shrink-0">
              LVL {node.level}
            </span>
            <span className="font-semibold text-white truncate max-w-[120px] sm:max-w-none">{node.username}</span>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between sm:justify-end items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-6 text-[13px] text-gray-500 w-full sm:w-auto mt-2 sm:mt-0 px-1 sm:px-0 font-medium">
            <span className="flex items-center">
              Invested: <span className="text-[#30D158] font-bold ml-1">${Number(node.totalInvested || 0).toFixed(2)}</span>
            </span>
            <span>Joined: {new Date(node.joinedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {expanded && hasChildren && (
        <div className="ml-8 mt-3 pl-4 border-l-2 border-[#38383A]/50 space-y-3 relative">
          {node.children.map((child) => (
             <div key={child.id} className="relative">
                {/* Visual connecting line */}
                <div className="absolute -left-4 top-5 w-4 h-[2px] bg-[#38383A]/50"></div>
                <TreeNode node={child} />
             </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReferralTree;
