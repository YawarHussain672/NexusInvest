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

  if (loading) return <div className="animate-pulse h-64 bg-gray-800 rounded-xl"></div>;

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center mb-6 border-b border-gray-700/50 pb-4">
        <div className="p-3 bg-indigo-500/10 rounded-xl mr-4">
          <Network className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">Referral Network</h3>
          <p className="text-sm text-gray-400">View your downline up to 3 levels deep</p>
        </div>
      </div>

      {treeData.length === 0 ? (
        <div className="text-center py-12 text-gray-400 bg-gray-900/50 rounded-xl border border-dashed border-gray-700">
          <UserSquare2 className="w-12 h-12 mx-auto text-gray-600 mb-3" />
          <p>You haven't referred anyone yet.</p>
          <p className="text-sm mt-1">Share your referral code to start earning level income!</p>
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
        className={`flex items-center p-3 rounded-lg border transition-colors ${
          hasChildren ? 'cursor-pointer hover:bg-gray-700/50 hover:border-gray-600' : 'bg-gray-900/30'
        } ${expanded ? 'bg-gray-700/30 border-gray-600' : 'border-transparent'}`}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        <div className="mr-3 w-6 flex justify-center">
          {hasChildren ? (
            expanded ? <ChevronDown className="w-4 h-4 text-indigo-400" /> : <ChevronRight className="w-4 h-4 text-gray-500" />
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-gray-600"></span>
          )}
        </div>
        
        <div className="flex-1 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className={`p-1.5 rounded text-white text-xs font-bold ${
              node.level === 1 ? 'bg-indigo-500' : node.level === 2 ? 'bg-purple-500' : 'bg-blue-500'
            }`}>
              L{node.level}
            </div>
            <span className="font-medium text-white">{node.username}</span>
          </div>
          
          <div className="flex items-center space-x-6 text-xs text-gray-400">
            <span>Invested: <span className="text-green-400 font-medium">${node.totalInvested}</span></span>
            <span className="hidden sm:inline">Joined: {new Date(node.joinedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {expanded && hasChildren && (
        <div className="ml-8 mt-3 pl-4 border-l-2 border-gray-700/50 space-y-3 relative">
          {node.children.map((child) => (
             <div key={child.id} className="relative">
                {/* Visual connecting line */}
                <div className="absolute -left-4 top-5 w-4 h-0.5 bg-gray-700/50"></div>
                <TreeNode node={child} />
             </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReferralTree;
