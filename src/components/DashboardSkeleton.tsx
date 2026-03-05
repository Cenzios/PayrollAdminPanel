import React from 'react';

const DashboardSkeleton = () => {
    return (
        <div className="space-y-8 animate-pulse">
            {/* Header Skeleton */}
            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <div className="h-10 w-48 bg-gray-200 rounded" />
                    <div className="h-5 w-32 bg-gray-200 rounded" />
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-2xl" />
            </div>

            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                        <div className="flex justify-between items-start">
                            <div className="space-y-2">
                                <div className="h-4 w-24 bg-gray-200 rounded" />
                                <div className="h-8 w-16 bg-gray-200 rounded" />
                            </div>
                            <div className="w-12 h-12 bg-gray-200 rounded-2xl" />
                        </div>
                        <div className="h-4 w-20 bg-gray-200 rounded" />
                    </div>
                ))}
            </div>

            {/* content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Chart Skeleton */}
                <div className="lg:col-span-3">
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-[400px] space-y-4">
                        <div className="h-6 w-40 bg-gray-200 rounded mb-6" />
                        <div className="flex items-end justify-between h-64 space-x-2 px-4">
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className="w-full bg-gray-200 rounded-t" style={{ height: `${Math.random() * 80 + 20}%` }} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Activities Skeleton */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full min-h-[400px]">
                        <div className="p-6 border-b border-gray-50">
                            <div className="h-6 w-32 bg-gray-200 rounded" />
                        </div>
                        <div className="p-6 space-y-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-start space-x-4">
                                    <div className="w-10 h-10 rounded-xl bg-gray-200 flex-shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-full bg-gray-200 rounded" />
                                        <div className="h-3 w-24 bg-gray-200 rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-2xl flex-shrink-0" />
                        <div className="space-y-2 flex-1">
                            <div className="h-5 w-24 bg-gray-200 rounded" />
                            <div className="h-4 w-32 bg-gray-200 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DashboardSkeleton;
