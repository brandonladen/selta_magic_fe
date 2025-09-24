import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { CarouselService } from "@/services/carouselService";
import { ImageType } from "@/components/carousel/useCarouselImages";
import { uploadImageToLocal } from "@/api/imageUpload";
import { Plus, Trash2, Edit, MoveUp, MoveDown, Upload, Image as ImageIcon } from "lucide-react";

export default function CarouselAdmin() {
  const [images, setImages] = useState<ImageType[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [newImageAlt, setNewImageAlt] = useState("");
  const [editImageAlt, setEditImageAlt] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = () => {
    try {
      const carouselImages = CarouselService.getCarouselImages();
      setImages(carouselImages);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load carousel images",
        variant: "destructive",
      });
    }
  };

  const handleAddImage = async () => {
    if (!newImageFile || !newImageAlt.trim()) {
      toast({
        title: "Error",
        description: "Please select an image and provide alt text",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const imagePath = await uploadImageToLocal(newImageFile);
      const newImage: ImageType = {
        src: imagePath,
        alt: newImageAlt.trim(),
      };
      
      const updatedImages = CarouselService.addImage(newImage);
      setImages(updatedImages);
      
      // Reset form
      setNewImageFile(null);
      setNewImageAlt("");
      setIsAddDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Image added to carousel successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    try {
      const updatedImages = CarouselService.removeImage(index);
      setImages(updatedImages);
      toast({
        title: "Success",
        description: "Image removed from carousel",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove image",
        variant: "destructive",
      });
    }
  };

  const handleEditImage = (index: number) => {
    setEditingIndex(index);
    setEditImageAlt(images[index].alt);
    setIsEditDialogOpen(true);
  };

  const handleUpdateImage = () => {
    if (editingIndex === null || !editImageAlt.trim()) {
      toast({
        title: "Error",
        description: "Please provide alt text",
        variant: "destructive",
      });
      return;
    }

    try {
      const updatedImage: ImageType = {
        ...images[editingIndex],
        alt: editImageAlt.trim(),
      };
      
      const updatedImages = CarouselService.updateImage(editingIndex, updatedImage);
      setImages(updatedImages);
      
      setIsEditDialogOpen(false);
      setEditingIndex(null);
      setEditImageAlt("");
      
      toast({
        title: "Success",
        description: "Image updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update image",
        variant: "destructive",
      });
    }
  };

  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= images.length) return;

    try {
      const updatedImages = CarouselService.reorderImages(index, newIndex);
      setImages(updatedImages);
      toast({
        title: "Success",
        description: "Image order updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reorder image",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImageFile(file);
    }
  };

  return (
    <AdminLayout title="Carousel Management">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            Manage the images displayed in the hero section carousel
          </p>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-selta-gold hover:bg-selta-gold/90 text-selta-deep-purple">
                <Plus className="h-4 w-4 mr-2" />
                Add Image
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Carousel Image</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="image-file">Image File</Label>
                  <Input
                    id="image-file"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mt-1"
                  />
                  {newImageFile && (
                    <p className="text-sm text-gray-500 mt-1">
                      Selected: {newImageFile.name}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="alt-text">Alt Text</Label>
                  <Input
                    id="alt-text"
                    value={newImageAlt}
                    onChange={(e) => setNewImageAlt(e.target.value)}
                    placeholder="Describe the image..."
                    className="mt-1"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                    disabled={isUploading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddImage}
                    disabled={isUploading || !newImageFile || !newImageAlt.trim()}
                  >
                    {isUploading ? (
                      <>
                        <Upload className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Image
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Current Carousel Images</CardTitle>
          </CardHeader>
          <CardContent>
            {images.length === 0 ? (
              <div className="text-center py-8">
                <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No images in carousel</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 border rounded-lg"
                  >
                    <div className="flex-shrink-0">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-20 h-20 object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-image.jpg';
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Position {index + 1}</p>
                      <p className="text-sm text-gray-600">{image.alt}</p>
                      <p className="text-xs text-gray-400 mt-1">{image.src}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMoveImage(index, 'up')}
                        disabled={index === 0}
                      >
                        <MoveUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMoveImage(index, 'down')}
                        disabled={index === images.length - 1}
                      >
                        <MoveDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditImage(index)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveImage(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Image Alt Text</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {editingIndex !== null && (
                <div>
                  <img
                    src={images[editingIndex]?.src}
                    alt={images[editingIndex]?.alt}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                </div>
              )}
              <div>
                <Label htmlFor="edit-alt-text">Alt Text</Label>
                <Input
                  id="edit-alt-text"
                  value={editImageAlt}
                  onChange={(e) => setEditImageAlt(e.target.value)}
                  placeholder="Describe the image..."
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateImage}
                  disabled={!editImageAlt.trim()}
                >
                  Update
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
