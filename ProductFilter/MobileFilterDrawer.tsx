
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { FilterState } from '@/hooks/useProductFilter';

interface MobileFilterDrawerProps {
  children: React.ReactNode;
  filterCount: number;
}

const MobileFilterDrawer = ({ children, filterCount }: MobileFilterDrawerProps) => {
  return (
    <div className="lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            {filterCount > 0 && (
              <span className="ml-1 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {filterCount}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[85%] sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="py-4">{children}</div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileFilterDrawer;
