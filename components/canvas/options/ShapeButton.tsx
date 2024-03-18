import { Button } from "@/components/ui/button"

const ShapeButton: React.FC<{
  icon: React.ReactNode
  onClick: () => void
  isActive: boolean
}> = ({ icon, onClick, isActive }) => (
  <Button
    className={`rounded-xl ${isActive ? "" : "bg-card"}`}
    onClick={onClick}
  >
    {icon}
  </Button>
)

export default ShapeButton
