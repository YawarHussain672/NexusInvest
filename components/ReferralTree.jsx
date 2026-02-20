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

  if (loading) return <div className="animate-pulse h-64 waterdrop rounded-[2rem]"></div>;

  return (
    <div className="waterdrop rounded-[2rem] p-6 relative overflow-hidden">
      <div className="flex items-center mb-6 border-b border-white/10 pb-4 relative z-10">
        <div className="p-3 bg-cyan-500/10 rounded-2xl mr-4 shadow-inner border border-white/5">
          <Network className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">Referral Network</h3>
          <p className="text-[13px] text-gray-300 font-medium">Your multi-level downline team</p>
        </div>
      </div>

      {treeData.length === 0 ? (
        <div className="text-center py-12 bg-black/30 backdrop-blur-md shadow-inner rounded-2xl border border-white/10 relative z-10">
          <UserSquare2 className="w-10 h-10 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-200 font-medium">You haven't referred anyone yet.</p>
          <p className="text-[13px] text-gray-400 mt-1">Share your referral code to start earning level income!</p>
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
    <div className="text-sm text-gray-300 relative z-10">
      <div 
        className={`flex items-center p-3 rounded-2xl border transition-all ${
          hasChildren ? 'cursor-pointer hover:bg-white/10 border-white/10 bg-black/20 shadow-inner backdrop-blur-sm' : 'bg-black/40 border-transparent backdrop-blur-sm'
        } ${expanded ? 'bg-white/5 border-white/20' : ''}`}
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
            <span className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full waterdrop-badge text-emerald-400 flex shrink-0">
              LVL {node.level}
            </span>
            <span className="font-semibold text-white truncate max-w-[120px] sm:max-w-none">{node.username}</span>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between sm:justify-end items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-6 text-[13px] text-gray-400 w-full sm:w-auto mt-2 sm:mt-0 px-1 sm:px-0 font-medium">
            <span className="flex items-center">
              Invested: <span className="text-emerald-400 font-bold ml-1">${Number(node.totalInvested || 0).toFixed(2)}</span>
            </span>
            <span>Joined: {new Date(node.joinedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {expanded && hasChildren && (
        <div className="ml-8 mt-3 pl-4 border-l border-white/10 space-y-3 relative">
          {node.children.map((child) => (
             <div key={child.id} className="relative z-10">
                {/* Visual connecting line */}
                <div className="absolute -left-4 top-5 w-4 h-[1px] bg-white/10"></div>
                <TreeNode node={child} />
             </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReferralTree;
